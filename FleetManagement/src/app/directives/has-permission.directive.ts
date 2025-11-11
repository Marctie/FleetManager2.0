import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { RoleService, Permission } from '../services/role.service';

/**
 * Direttiva per mostrare/nascondere elementi in base ai permessi
 * Uso: <button *hasPermission="Permission.VEHICLES_DELETE">Delete</button>
 */
@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective implements OnInit {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private roleService = inject(RoleService);

  @Input() hasPermission!: Permission | Permission[];

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const permissions = Array.isArray(this.hasPermission)
      ? this.hasPermission
      : [this.hasPermission];
    const hasAccess = this.roleService.hasAnyPermission(permissions);

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
