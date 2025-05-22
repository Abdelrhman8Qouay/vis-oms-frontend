// src/utils/types/order.type.ts
import type { CustomerDetails } from './cashier.type'
import type { MenuItem } from './menu.type'
import type { User } from './user.type'

export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
    FAILED = 'failed',
}

export enum OrderTypes {
    DINE_IN = 'dine_in',
    TAKEAWAY = 'takeaway',
    DELIVERY = 'delivery',
}


export enum OrderActionType {
    CREATED = 'created',
    UPDATED = 'updated',
    STATUS_CHANGED = 'status_changed',
    CANCELLED = 'cancelled',
    OVERRIDDEN = 'overridden',
    FORCE_CHANGED = 'force_changed',
}

export interface OrderHistoryEntry {
    id: string
    action: OrderActionType
    adminId: string
    admin?: User
    timestamp: string
    changes?: {
        status?: {
            from: OrderStatus
            to: OrderStatus
        }
        type?: {
            from: OrderTypes
            to: OrderTypes
        }
    }
    forced?: boolean
    reason?: string
    notes?: string
}

export interface LastAdminAction {
    action: OrderActionType
    adminId: string
    admin?: User
    timestamp: string
}

export interface OrderHistoryResponse {
    history: OrderHistoryEntry[]
    lastAdminAction: LastAdminAction
    currentStatus: OrderStatus
}

export interface OrderItemObject {
    id: string
    name: string
    price: number
    quantity: number
    menuItem: MenuItem
    totalPrice: number
}

export interface OrderCustomerDetails {
    name?: string
    phone?: string
    address?: string
}

export interface OrderAdminAction {
    adminId: string
    action: string
    timestamp: Date | string
}

export interface OrderOverride {
    reason: string
    adminId: string
    timestamp: Date | string
    previousStatus: OrderStatus
    newStatus?: OrderStatus
    forced?: boolean
}

export interface OrderCancellation {
    reason: string
    refundRequested?: boolean
    canceledByAdmin?: string
    timestamp: Date | string
}

export interface OrderMetadata {
    adminNotes?: string
    overrides?: OrderOverride[]
    cancellation?: OrderCancellation
    lastAdminAction?: OrderAdminAction
}

export interface OrderObject {
    id: string
    status: OrderStatus
    type: OrderTypes
    totalPrice: number
    dailyQueueNumber: number
    itemsCount: number
    customerDetails: CustomerDetails
    customer?: User | null
    items: OrderItemObject[]
    createdAt: string
    updatedAt: string
    metadata?: OrderMetadata
}