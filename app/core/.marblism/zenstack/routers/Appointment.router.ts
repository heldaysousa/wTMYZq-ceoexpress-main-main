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

        createMany: procedure.input($Schema.AppointmentInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointment.createMany(input as any))),

        create: procedure.input($Schema.AppointmentInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointment.create(input as any))),

        deleteMany: procedure.input($Schema.AppointmentInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointment.deleteMany(input as any))),

        delete: procedure.input($Schema.AppointmentInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointment.delete(input as any))),

        findFirst: procedure.input($Schema.AppointmentInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).appointment.findFirst(input as any))),

        findMany: procedure.input($Schema.AppointmentInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).appointment.findMany(input as any))),

        findUnique: procedure.input($Schema.AppointmentInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).appointment.findUnique(input as any))),

        updateMany: procedure.input($Schema.AppointmentInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointment.updateMany(input as any))),

        update: procedure.input($Schema.AppointmentInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).appointment.update(input as any))),

        count: procedure.input($Schema.AppointmentInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).appointment.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.AppointmentCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AppointmentCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AppointmentCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AppointmentCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.AppointmentCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AppointmentCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.AppointmentGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.AppointmentGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AppointmentCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AppointmentCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.AppointmentGetPayload<T>, Context>) => Promise<Prisma.AppointmentGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.AppointmentDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AppointmentDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AppointmentDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AppointmentDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.AppointmentDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AppointmentDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.AppointmentGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.AppointmentGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AppointmentDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AppointmentDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.AppointmentGetPayload<T>, Context>) => Promise<Prisma.AppointmentGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.AppointmentFindFirstArgs, TData = Prisma.AppointmentGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.AppointmentFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.AppointmentGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.AppointmentFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.AppointmentFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.AppointmentGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.AppointmentGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.AppointmentFindManyArgs, TData = Array<Prisma.AppointmentGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.AppointmentFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.AppointmentGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.AppointmentFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.AppointmentFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.AppointmentGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.AppointmentGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.AppointmentFindUniqueArgs, TData = Prisma.AppointmentGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.AppointmentFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.AppointmentGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.AppointmentFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.AppointmentFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.AppointmentGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.AppointmentGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.AppointmentUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AppointmentUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AppointmentUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AppointmentUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.AppointmentUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.AppointmentUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.AppointmentGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.AppointmentGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.AppointmentUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.AppointmentUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.AppointmentGetPayload<T>, Context>) => Promise<Prisma.AppointmentGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.AppointmentCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.AppointmentCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.AppointmentCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.AppointmentCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.AppointmentCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.AppointmentCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.AppointmentCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.AppointmentCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
