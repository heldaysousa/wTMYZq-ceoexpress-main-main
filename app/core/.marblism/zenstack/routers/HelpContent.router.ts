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

        createMany: procedure.input($Schema.HelpContentInputSchema.createMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).helpContent.createMany(input as any))),

        create: procedure.input($Schema.HelpContentInputSchema.create).mutation(async ({ ctx, input }) => checkMutate(db(ctx).helpContent.create(input as any))),

        deleteMany: procedure.input($Schema.HelpContentInputSchema.deleteMany.optional()).mutation(async ({ ctx, input }) => checkMutate(db(ctx).helpContent.deleteMany(input as any))),

        delete: procedure.input($Schema.HelpContentInputSchema.delete).mutation(async ({ ctx, input }) => checkMutate(db(ctx).helpContent.delete(input as any))),

        findFirst: procedure.input($Schema.HelpContentInputSchema.findFirst.optional()).query(({ ctx, input }) => checkRead(db(ctx).helpContent.findFirst(input as any))),

        findMany: procedure.input($Schema.HelpContentInputSchema.findMany.optional()).query(({ ctx, input }) => checkRead(db(ctx).helpContent.findMany(input as any))),

        findUnique: procedure.input($Schema.HelpContentInputSchema.findUnique).query(({ ctx, input }) => checkRead(db(ctx).helpContent.findUnique(input as any))),

        updateMany: procedure.input($Schema.HelpContentInputSchema.updateMany).mutation(async ({ ctx, input }) => checkMutate(db(ctx).helpContent.updateMany(input as any))),

        update: procedure.input($Schema.HelpContentInputSchema.update).mutation(async ({ ctx, input }) => checkMutate(db(ctx).helpContent.update(input as any))),

        count: procedure.input($Schema.HelpContentInputSchema.count.optional()).query(({ ctx, input }) => checkRead(db(ctx).helpContent.count(input as any))),

    }
    );
}

export interface ClientType<AppRouter extends AnyRouter, Context = AppRouter['_def']['_config']['$types']['ctx']> {
    createMany: {

        useMutation: <T extends Prisma.HelpContentCreateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.HelpContentCreateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.HelpContentCreateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.HelpContentCreateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    create: {

        useMutation: <T extends Prisma.HelpContentCreateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.HelpContentCreateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.HelpContentGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.HelpContentGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.HelpContentCreateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.HelpContentCreateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.HelpContentGetPayload<T>, Context>) => Promise<Prisma.HelpContentGetPayload<T>>
            };

    };
    deleteMany: {

        useMutation: <T extends Prisma.HelpContentDeleteManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.HelpContentDeleteManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.HelpContentDeleteManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.HelpContentDeleteManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    delete: {

        useMutation: <T extends Prisma.HelpContentDeleteArgs>(opts?: UseTRPCMutationOptions<
            Prisma.HelpContentDeleteArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.HelpContentGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.HelpContentGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.HelpContentDeleteArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.HelpContentDeleteArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.HelpContentGetPayload<T>, Context>) => Promise<Prisma.HelpContentGetPayload<T>>
            };

    };
    findFirst: {

        useQuery: <T extends Prisma.HelpContentFindFirstArgs, TData = Prisma.HelpContentGetPayload<T>>(
            input?: Prisma.SelectSubset<T, Prisma.HelpContentFindFirstArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.HelpContentGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.HelpContentFindFirstArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.HelpContentFindFirstArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.HelpContentGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.HelpContentGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findMany: {

        useQuery: <T extends Prisma.HelpContentFindManyArgs, TData = Array<Prisma.HelpContentGetPayload<T>>>(
            input?: Prisma.SelectSubset<T, Prisma.HelpContentFindManyArgs>,
            opts?: UseTRPCQueryOptions<string, T, Array<Prisma.HelpContentGetPayload<T>>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.HelpContentFindManyArgs>(
            input?: Omit<Prisma.SelectSubset<T, Prisma.HelpContentFindManyArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Array<Prisma.HelpContentGetPayload<T>>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Array<Prisma.HelpContentGetPayload<T>>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    findUnique: {

        useQuery: <T extends Prisma.HelpContentFindUniqueArgs, TData = Prisma.HelpContentGetPayload<T>>(
            input: Prisma.SelectSubset<T, Prisma.HelpContentFindUniqueArgs>,
            opts?: UseTRPCQueryOptions<string, T, Prisma.HelpContentGetPayload<T>, TData, Error>
        ) => UseTRPCQueryResult<
            TData,
            TRPCClientErrorLike<AppRouter>
        >;
        useInfiniteQuery: <T extends Prisma.HelpContentFindUniqueArgs>(
            input: Omit<Prisma.SelectSubset<T, Prisma.HelpContentFindUniqueArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, Prisma.HelpContentGetPayload<T>, Error>
        ) => UseTRPCInfiniteQueryResult<
            Prisma.HelpContentGetPayload<T>,
            TRPCClientErrorLike<AppRouter>
        >;

    };
    updateMany: {

        useMutation: <T extends Prisma.HelpContentUpdateManyArgs>(opts?: UseTRPCMutationOptions<
            Prisma.HelpContentUpdateManyArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.BatchPayload,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.BatchPayload, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.HelpContentUpdateManyArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.HelpContentUpdateManyArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.BatchPayload, Context>) => Promise<Prisma.BatchPayload>
            };

    };
    update: {

        useMutation: <T extends Prisma.HelpContentUpdateArgs>(opts?: UseTRPCMutationOptions<
            Prisma.HelpContentUpdateArgs,
            TRPCClientErrorLike<AppRouter>,
            Prisma.HelpContentGetPayload<T>,
            Context
        >,) =>
            Omit<UseTRPCMutationResult<Prisma.HelpContentGetPayload<T>, TRPCClientErrorLike<AppRouter>, Prisma.SelectSubset<T, Prisma.HelpContentUpdateArgs>, Context>, 'mutateAsync'> & {
                mutateAsync:
                <T extends Prisma.HelpContentUpdateArgs>(variables: T, opts?: UseTRPCMutationOptions<T, TRPCClientErrorLike<AppRouter>, Prisma.HelpContentGetPayload<T>, Context>) => Promise<Prisma.HelpContentGetPayload<T>>
            };

    };
    count: {

        useQuery: <T extends Prisma.HelpContentCountArgs, TData = 'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.HelpContentCountAggregateOutputType>
            : number>(
                input?: Prisma.Subset<T, Prisma.HelpContentCountArgs>,
                opts?: UseTRPCQueryOptions<string, T, 'select' extends keyof T
                    ? T['select'] extends true
                    ? number
                    : Prisma.GetScalarType<T['select'], Prisma.HelpContentCountAggregateOutputType>
                    : number, TData, Error>
            ) => UseTRPCQueryResult<
                TData,
                TRPCClientErrorLike<AppRouter>
            >;
        useInfiniteQuery: <T extends Prisma.HelpContentCountArgs>(
            input?: Omit<Prisma.Subset<T, Prisma.HelpContentCountArgs>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<string, T, 'select' extends keyof T
                ? T['select'] extends true
                ? number
                : Prisma.GetScalarType<T['select'], Prisma.HelpContentCountAggregateOutputType>
                : number, Error>
        ) => UseTRPCInfiniteQueryResult<
            'select' extends keyof T
            ? T['select'] extends true
            ? number
            : Prisma.GetScalarType<T['select'], Prisma.HelpContentCountAggregateOutputType>
            : number,
            TRPCClientErrorLike<AppRouter>
        >;

    };
}
