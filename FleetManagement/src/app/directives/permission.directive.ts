import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../models/user-roles';

/**
 * Direttiva strutturale per controllare i permessi nel template
 *
 * Uso:
 * <button *hasPermission="'CREATE_VEHICLE'">Create Vehicle</button>
 * <div *hasPermission="['CREATE_VEHICLE', 'EDIT_VEHICLE']">...</div>
 * <button *hasPermission="'DELETE_VEHICLE'; else noPermission">Delete</button>
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit {
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private permissions: Permission[] = [];
  private elseTemplateRef: TemplateRef<any> | null = null;

  @Input()
  set hasPermission(val: Permission | Permission[] | string | string[]) {
    // Converti input in array di Permission
    if (Array.isArray(val)) {
      this.permissions = val as Permission[];
    } else {
      this.permissions = [val as Permission];
    }
    this.updateView();
  }

  @Input()
  set hasPermissionElse(templateRef: TemplateRef<any> | null) {
    this.elseTemplateRef = templateRef;
    this.updateView();
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const currentUser = this.authService.getCurrentUserInfo();

    if (!currentUser) {
      // Utente non autenticato, mostra template else o nascondi
      this.viewContainer.clear();
      if (this.elseTemplateRef) {
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
      }
      return;
    }

    // Verifica se l'utente ha TUTTI i permessi richiesti
    const hasAllPermissions = this.permissionService.hasAllPermissions(
      currentUser.role,
      this.permissions
    );

    this.viewContainer.clear();
    if (hasAllPermissions) {
      // Ha i permessi, mostra il contenuto
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.elseTemplateRef) {
      // Non ha i permessi, mostra il template else
      this.viewContainer.createEmbeddedView(this.elseTemplateRef);
    }
  }
}

/**
 * Direttiva per verificare se l'utente ha ALMENO UNO dei permessi
 *
 * Uso:
 * <div *hasAnyPermission="['VIEW_VEHICLES', 'VIEW_DASHBOARD']">...</div>
 */
@Directive({
  selector: '[hasAnyPermission]',
  standalone: true,
})
export class HasAnyPermissionDirective implements OnInit {
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private permissions: Permission[] = [];

  @Input()
  set hasAnyPermission(val: Permission[] | string[]) {
    this.permissions = val as Permission[];
    this.updateView();
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const currentUser = this.authService.getCurrentUserInfo();

    if (!currentUser) {
      this.viewContainer.clear();
      return;
    }

    const hasAnyPermission = this.permissionService.hasAnyPermission(
      currentUser.role,
      this.permissions
    );

    this.viewContainer.clear();
    if (hasAnyPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

/**
 * Direttiva per verificare il ruolo dell'utente
 *
 * Uso:
 * <div *hasRole="'ADMINISTRATOR'">Admin only</div>
 * <div *hasRole="['ADMINISTRATOR', 'FLEET_MANAGER']">Managers only</div>
 */
@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  private roles: string[] = [];

  @Input()
  set hasRole(val: string | string[]) {
    this.roles = Array.isArray(val) ? val : [val];
    this.updateView();
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const currentUser = this.authService.getCurrentUserInfo();

    if (!currentUser) {
      this.viewContainer.clear();
      return;
    }

    const hasRole = this.roles.includes(currentUser.role);

    this.viewContainer.clear();
    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
