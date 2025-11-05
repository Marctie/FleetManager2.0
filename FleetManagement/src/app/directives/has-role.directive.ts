import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { RoleService } from '../services/role.service';

/**
 * Direttiva per mostrare/nascondere elementi in base al ruolo
 * Uso: <div *hasRole="'Administrator'">Admin Only</div>
 */
@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private roleService = inject(RoleService);

  @Input() hasRole!: string | string[];

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const currentRole = this.roleService.getCurrentUserRole();
    if (!currentRole) {
      this.viewContainer.clear();
      return;
    }

    const allowedRoles = Array.isArray(this.hasRole) ? this.hasRole : [this.hasRole];
    const hasAccess = allowedRoles.includes(currentRole);

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
