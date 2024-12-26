/* eslint-disable */
import type { unsetMarker, AnyRouter, AnyRootConfig, CreateRouterInner, Procedure, ProcedureBuilder, ProcedureParams, ProcedureRouterRecord, ProcedureType } from "@trpc/server";
import type { PrismaClient } from "@prisma/client";
import createUserRouter from "./User.router";
import createClientRouter from "./Client.router";
import createServiceRouter from "./Service.router";
import createTeamMemberRouter from "./TeamMember.router";
import createAppointmentRouter from "./Appointment.router";
import createTransactionRouter from "./Transaction.router";
import createSubscriptionRouter from "./Subscription.router";
import createNotificationRouter from "./Notification.router";
import createHelpContentRouter from "./HelpContent.router";
import createSupportTicketRouter from "./SupportTicket.router";
import createTaskRouter from "./Task.router";
import { ClientType as UserClientType } from "./User.router";
import { ClientType as ClientClientType } from "./Client.router";
import { ClientType as ServiceClientType } from "./Service.router";
import { ClientType as TeamMemberClientType } from "./TeamMember.router";
import { ClientType as AppointmentClientType } from "./Appointment.router";
import { ClientType as TransactionClientType } from "./Transaction.router";
import { ClientType as SubscriptionClientType } from "./Subscription.router";
import { ClientType as NotificationClientType } from "./Notification.router";
import { ClientType as HelpContentClientType } from "./HelpContent.router";
import { ClientType as SupportTicketClientType } from "./SupportTicket.router";
import { ClientType as TaskClientType } from "./Task.router";

export type BaseConfig = AnyRootConfig;

export type RouterFactory<Config extends BaseConfig> = <
    ProcRouterRecord extends ProcedureRouterRecord
>(
    procedures: ProcRouterRecord
) => CreateRouterInner<Config, ProcRouterRecord>;

export type UnsetMarker = typeof unsetMarker;

export type ProcBuilder<Config extends BaseConfig> = ProcedureBuilder<
    ProcedureParams<Config, any, any, any, UnsetMarker, UnsetMarker, any>
>;

export function db(ctx: any) {
    if (!ctx.prisma) {
        throw new Error('Missing "prisma" field in trpc context');
    }
    return ctx.prisma as PrismaClient;
}

export function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({
        user: createUserRouter(router, procedure),
        client: createClientRouter(router, procedure),
        service: createServiceRouter(router, procedure),
        teamMember: createTeamMemberRouter(router, procedure),
        appointment: createAppointmentRouter(router, procedure),
        transaction: createTransactionRouter(router, procedure),
        subscription: createSubscriptionRouter(router, procedure),
        notification: createNotificationRouter(router, procedure),
        helpContent: createHelpContentRouter(router, procedure),
        supportTicket: createSupportTicketRouter(router, procedure),
        task: createTaskRouter(router, procedure),
    }
    );
}

export interface ClientType<AppRouter extends AnyRouter> {
    user: UserClientType<AppRouter>;
    client: ClientClientType<AppRouter>;
    service: ServiceClientType<AppRouter>;
    teamMember: TeamMemberClientType<AppRouter>;
    appointment: AppointmentClientType<AppRouter>;
    transaction: TransactionClientType<AppRouter>;
    subscription: SubscriptionClientType<AppRouter>;
    notification: NotificationClientType<AppRouter>;
    helpContent: HelpContentClientType<AppRouter>;
    supportTicket: SupportTicketClientType<AppRouter>;
    task: TaskClientType<AppRouter>;
}
