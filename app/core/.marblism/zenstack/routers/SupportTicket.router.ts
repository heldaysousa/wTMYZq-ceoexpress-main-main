/* eslint-disable */
import { type RouterFactory, type ProcBuilder, type BaseConfig, db } from ".";
import * as _Schema from '@zenstackhq/runtime/zod/input';
const $Schema: typeof _Schema = (_Schema as any).default ?? _Schema;
import { checkRead, checkMutate } from '../helper';
import type { Prisma } from '@prisma/client';
import type { UseTRPCMutationOptions, UseTRPCMutationResult, UseTRPCQueryOptions, UseTRPCQueryResult, UseTRPCInfiniteQueryOptions, UseTRPCInfiniteQueryResult } from '@trpc/react-query/shared';
import type { TRPCClientErrorLike } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';

export default function createRouter<Config extends BaseConfig>(router: RouterFactory<Config>, procedure: ProcBuilder<Config>) {
    return router({

        createMany: procedure.input($Schema.SupportTicketInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).supportTicket.createMany(input as any))),

        create: procedure.input($Schema.SupportTicketInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).supportTicket.create(input as any))),

        deleteMany: procedure.input($Schema.SupportTicketInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).supportTicket.deleteMany(input as any))),

        delete: procedure.input($Schema.SupportTicketInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).supportTicket.delete(input as any))),

        findFirst: procedure.input($Schema.SupportTicketInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).supportTicket.findFirst(input as any))),

        findMany: procedure.input($Schema.SupportTicketInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).supportTicket.findMany(input as any))),

        findUnique: procedure.input($Schema.SupportTicketInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).supportTicket.findUnique(input as any))),

        updateMany: procedure.input($Schema.SupportTicketInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).supportTicket.updateMany(input as any))),

        update: procedure.input($Schema.SupportTicketInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).supportTicket.update(input as any))),

        count: procedure.input($Schema.SupportTicketInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).supportTicket.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.SupportTicketCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.SupportTicketCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.SupportTicketCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.SupportTicketCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.SupportTicketCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.SupportTicketCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.SupportTicketGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.SupportTicketGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.SupportTicketCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.SupportTicketCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.SupportTicketGetPayload<T>, Context>) => Promise<Prisma.SupportTicketGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.SupportTicketDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.SupportTicketDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.SupportTicketDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.SupportTicketDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.SupportTicketDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.SupportTicketDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.SupportTicketGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.SupportTicketGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.SupportTicketDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.SupportTicketDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.SupportTicketGetPayload<T>, Context>) => Promise<Prisma.SupportTicketGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.SupportTicketFindFirstArgs, TData = Prisma.SupportTicketGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.SupportTicketFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.SupportTicketGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.SupportTicketFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.SupportTicketFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.SupportTicketGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.SupportTicketGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.SupportTicketFindManyArgs, TData = Array<Prisma.SupportTicketGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.SupportTicketFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.SupportTicketGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.SupportTicketFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.SupportTicketFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.SupportTicketGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.SupportTicketGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.SupportTicketFindUniqueArgs, TData = Prisma.SupportTicketGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.SupportTicketFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.SupportTicketGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.SupportTicketFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.SupportTicketFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.SupportTicketGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.SupportTicketGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.SupportTicketUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.SupportTicketUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.SupportTicketUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.SupportTicketUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.SupportTicketUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.SupportTicketUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.SupportTicketGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.SupportTicketGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.SupportTicketUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.SupportTicketUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.SupportTicketGetPayload<T>, Context>) => Promise<Prisma.SupportTicketGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.SupportTicketCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.SupportTicketCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.SupportTicketCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.SupportTicketCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.SupportTicketCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.SupportTicketCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.SupportTicketCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.SupportTicketCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
