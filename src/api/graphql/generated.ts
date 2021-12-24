import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  numeric: any;
  timestamptz: any;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

/** columns and relationships of "collection" */
export type Collection = {
  __typename?: 'collection';
  address: Scalars['String'];
  created_at: Scalars['timestamptz'];
  floorPrice: Scalars['numeric'];
  name: Scalars['String'];
  profitThreshold: Scalars['numeric'];
  slug: Scalars['String'];
  symbol: Scalars['String'];
  twitterUsername?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "collection" */
export type Collection_Aggregate = {
  __typename?: 'collection_aggregate';
  aggregate?: Maybe<Collection_Aggregate_Fields>;
  nodes: Array<Collection>;
};

/** aggregate fields of "collection" */
export type Collection_Aggregate_Fields = {
  __typename?: 'collection_aggregate_fields';
  avg?: Maybe<Collection_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Collection_Max_Fields>;
  min?: Maybe<Collection_Min_Fields>;
  stddev?: Maybe<Collection_Stddev_Fields>;
  stddev_pop?: Maybe<Collection_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Collection_Stddev_Samp_Fields>;
  sum?: Maybe<Collection_Sum_Fields>;
  var_pop?: Maybe<Collection_Var_Pop_Fields>;
  var_samp?: Maybe<Collection_Var_Samp_Fields>;
  variance?: Maybe<Collection_Variance_Fields>;
};


/** aggregate fields of "collection" */
export type Collection_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Collection_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Collection_Avg_Fields = {
  __typename?: 'collection_avg_fields';
  floorPrice?: Maybe<Scalars['Float']>;
  profitThreshold?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "collection". All fields are combined with a logical 'AND'. */
export type Collection_Bool_Exp = {
  _and?: InputMaybe<Array<Collection_Bool_Exp>>;
  _not?: InputMaybe<Collection_Bool_Exp>;
  _or?: InputMaybe<Array<Collection_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  floorPrice?: InputMaybe<Numeric_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  profitThreshold?: InputMaybe<Numeric_Comparison_Exp>;
  slug?: InputMaybe<String_Comparison_Exp>;
  symbol?: InputMaybe<String_Comparison_Exp>;
  twitterUsername?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "collection" */
export enum Collection_Constraint {
  /** unique or primary key constraint */
  CollectionPkey = 'collection_pkey'
}

/** input type for incrementing numeric columns in table "collection" */
export type Collection_Inc_Input = {
  floorPrice?: InputMaybe<Scalars['numeric']>;
  profitThreshold?: InputMaybe<Scalars['numeric']>;
};

/** input type for inserting data into table "collection" */
export type Collection_Insert_Input = {
  address?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  floorPrice?: InputMaybe<Scalars['numeric']>;
  name?: InputMaybe<Scalars['String']>;
  profitThreshold?: InputMaybe<Scalars['numeric']>;
  slug?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  twitterUsername?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Collection_Max_Fields = {
  __typename?: 'collection_max_fields';
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  floorPrice?: Maybe<Scalars['numeric']>;
  name?: Maybe<Scalars['String']>;
  profitThreshold?: Maybe<Scalars['numeric']>;
  slug?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  twitterUsername?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Collection_Min_Fields = {
  __typename?: 'collection_min_fields';
  address?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  floorPrice?: Maybe<Scalars['numeric']>;
  name?: Maybe<Scalars['String']>;
  profitThreshold?: Maybe<Scalars['numeric']>;
  slug?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  twitterUsername?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "collection" */
export type Collection_Mutation_Response = {
  __typename?: 'collection_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Collection>;
};

/** on conflict condition type for table "collection" */
export type Collection_On_Conflict = {
  constraint: Collection_Constraint;
  update_columns?: Array<Collection_Update_Column>;
  where?: InputMaybe<Collection_Bool_Exp>;
};

/** Ordering options when selecting data from "collection". */
export type Collection_Order_By = {
  address?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  floorPrice?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  profitThreshold?: InputMaybe<Order_By>;
  slug?: InputMaybe<Order_By>;
  symbol?: InputMaybe<Order_By>;
  twitterUsername?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: collection */
export type Collection_Pk_Columns_Input = {
  address: Scalars['String'];
};

/** select columns of table "collection" */
export enum Collection_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FloorPrice = 'floorPrice',
  /** column name */
  Name = 'name',
  /** column name */
  ProfitThreshold = 'profitThreshold',
  /** column name */
  Slug = 'slug',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  TwitterUsername = 'twitterUsername',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "collection" */
export type Collection_Set_Input = {
  address?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  floorPrice?: InputMaybe<Scalars['numeric']>;
  name?: InputMaybe<Scalars['String']>;
  profitThreshold?: InputMaybe<Scalars['numeric']>;
  slug?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  twitterUsername?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Collection_Stddev_Fields = {
  __typename?: 'collection_stddev_fields';
  floorPrice?: Maybe<Scalars['Float']>;
  profitThreshold?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Collection_Stddev_Pop_Fields = {
  __typename?: 'collection_stddev_pop_fields';
  floorPrice?: Maybe<Scalars['Float']>;
  profitThreshold?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Collection_Stddev_Samp_Fields = {
  __typename?: 'collection_stddev_samp_fields';
  floorPrice?: Maybe<Scalars['Float']>;
  profitThreshold?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Collection_Sum_Fields = {
  __typename?: 'collection_sum_fields';
  floorPrice?: Maybe<Scalars['numeric']>;
  profitThreshold?: Maybe<Scalars['numeric']>;
};

/** update columns of table "collection" */
export enum Collection_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  FloorPrice = 'floorPrice',
  /** column name */
  Name = 'name',
  /** column name */
  ProfitThreshold = 'profitThreshold',
  /** column name */
  Slug = 'slug',
  /** column name */
  Symbol = 'symbol',
  /** column name */
  TwitterUsername = 'twitterUsername',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** aggregate var_pop on columns */
export type Collection_Var_Pop_Fields = {
  __typename?: 'collection_var_pop_fields';
  floorPrice?: Maybe<Scalars['Float']>;
  profitThreshold?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Collection_Var_Samp_Fields = {
  __typename?: 'collection_var_samp_fields';
  floorPrice?: Maybe<Scalars['Float']>;
  profitThreshold?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Collection_Variance_Fields = {
  __typename?: 'collection_variance_fields';
  floorPrice?: Maybe<Scalars['Float']>;
  profitThreshold?: Maybe<Scalars['Float']>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "collection" */
  delete_collection?: Maybe<Collection_Mutation_Response>;
  /** delete single row from the table: "collection" */
  delete_collection_by_pk?: Maybe<Collection>;
  /** insert data into the table: "collection" */
  insert_collection?: Maybe<Collection_Mutation_Response>;
  /** insert a single row into the table: "collection" */
  insert_collection_one?: Maybe<Collection>;
  /** update data of the table: "collection" */
  update_collection?: Maybe<Collection_Mutation_Response>;
  /** update single row of the table: "collection" */
  update_collection_by_pk?: Maybe<Collection>;
};


/** mutation root */
export type Mutation_RootDelete_CollectionArgs = {
  where: Collection_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Collection_By_PkArgs = {
  address: Scalars['String'];
};


/** mutation root */
export type Mutation_RootInsert_CollectionArgs = {
  objects: Array<Collection_Insert_Input>;
  on_conflict?: InputMaybe<Collection_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Collection_OneArgs = {
  object: Collection_Insert_Input;
  on_conflict?: InputMaybe<Collection_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_CollectionArgs = {
  _inc?: InputMaybe<Collection_Inc_Input>;
  _set?: InputMaybe<Collection_Set_Input>;
  where: Collection_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Collection_By_PkArgs = {
  _inc?: InputMaybe<Collection_Inc_Input>;
  _set?: InputMaybe<Collection_Set_Input>;
  pk_columns: Collection_Pk_Columns_Input;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['numeric']>;
  _gt?: InputMaybe<Scalars['numeric']>;
  _gte?: InputMaybe<Scalars['numeric']>;
  _in?: InputMaybe<Array<Scalars['numeric']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['numeric']>;
  _lte?: InputMaybe<Scalars['numeric']>;
  _neq?: InputMaybe<Scalars['numeric']>;
  _nin?: InputMaybe<Array<Scalars['numeric']>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "collection" */
  collection: Array<Collection>;
  /** fetch aggregated fields from the table: "collection" */
  collection_aggregate: Collection_Aggregate;
  /** fetch data from the table: "collection" using primary key columns */
  collection_by_pk?: Maybe<Collection>;
};


export type Query_RootCollectionArgs = {
  distinct_on?: InputMaybe<Array<Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Collection_Order_By>>;
  where?: InputMaybe<Collection_Bool_Exp>;
};


export type Query_RootCollection_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Collection_Order_By>>;
  where?: InputMaybe<Collection_Bool_Exp>;
};


export type Query_RootCollection_By_PkArgs = {
  address: Scalars['String'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "collection" */
  collection: Array<Collection>;
  /** fetch aggregated fields from the table: "collection" */
  collection_aggregate: Collection_Aggregate;
  /** fetch data from the table: "collection" using primary key columns */
  collection_by_pk?: Maybe<Collection>;
};


export type Subscription_RootCollectionArgs = {
  distinct_on?: InputMaybe<Array<Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Collection_Order_By>>;
  where?: InputMaybe<Collection_Bool_Exp>;
};


export type Subscription_RootCollection_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Collection_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Collection_Order_By>>;
  where?: InputMaybe<Collection_Bool_Exp>;
};


export type Subscription_RootCollection_By_PkArgs = {
  address: Scalars['String'];
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  String_comparison_exp: String_Comparison_Exp;
  collection: ResolverTypeWrapper<Collection>;
  collection_aggregate: ResolverTypeWrapper<Collection_Aggregate>;
  collection_aggregate_fields: ResolverTypeWrapper<Collection_Aggregate_Fields>;
  collection_avg_fields: ResolverTypeWrapper<Collection_Avg_Fields>;
  collection_bool_exp: Collection_Bool_Exp;
  collection_constraint: Collection_Constraint;
  collection_inc_input: Collection_Inc_Input;
  collection_insert_input: Collection_Insert_Input;
  collection_max_fields: ResolverTypeWrapper<Collection_Max_Fields>;
  collection_min_fields: ResolverTypeWrapper<Collection_Min_Fields>;
  collection_mutation_response: ResolverTypeWrapper<Collection_Mutation_Response>;
  collection_on_conflict: Collection_On_Conflict;
  collection_order_by: Collection_Order_By;
  collection_pk_columns_input: Collection_Pk_Columns_Input;
  collection_select_column: Collection_Select_Column;
  collection_set_input: Collection_Set_Input;
  collection_stddev_fields: ResolverTypeWrapper<Collection_Stddev_Fields>;
  collection_stddev_pop_fields: ResolverTypeWrapper<Collection_Stddev_Pop_Fields>;
  collection_stddev_samp_fields: ResolverTypeWrapper<Collection_Stddev_Samp_Fields>;
  collection_sum_fields: ResolverTypeWrapper<Collection_Sum_Fields>;
  collection_update_column: Collection_Update_Column;
  collection_var_pop_fields: ResolverTypeWrapper<Collection_Var_Pop_Fields>;
  collection_var_samp_fields: ResolverTypeWrapper<Collection_Var_Samp_Fields>;
  collection_variance_fields: ResolverTypeWrapper<Collection_Variance_Fields>;
  mutation_root: ResolverTypeWrapper<{}>;
  numeric: ResolverTypeWrapper<Scalars['numeric']>;
  numeric_comparison_exp: Numeric_Comparison_Exp;
  order_by: Order_By;
  query_root: ResolverTypeWrapper<{}>;
  subscription_root: ResolverTypeWrapper<{}>;
  timestamptz: ResolverTypeWrapper<Scalars['timestamptz']>;
  timestamptz_comparison_exp: Timestamptz_Comparison_Exp;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  String: Scalars['String'];
  String_comparison_exp: String_Comparison_Exp;
  collection: Collection;
  collection_aggregate: Collection_Aggregate;
  collection_aggregate_fields: Collection_Aggregate_Fields;
  collection_avg_fields: Collection_Avg_Fields;
  collection_bool_exp: Collection_Bool_Exp;
  collection_inc_input: Collection_Inc_Input;
  collection_insert_input: Collection_Insert_Input;
  collection_max_fields: Collection_Max_Fields;
  collection_min_fields: Collection_Min_Fields;
  collection_mutation_response: Collection_Mutation_Response;
  collection_on_conflict: Collection_On_Conflict;
  collection_order_by: Collection_Order_By;
  collection_pk_columns_input: Collection_Pk_Columns_Input;
  collection_set_input: Collection_Set_Input;
  collection_stddev_fields: Collection_Stddev_Fields;
  collection_stddev_pop_fields: Collection_Stddev_Pop_Fields;
  collection_stddev_samp_fields: Collection_Stddev_Samp_Fields;
  collection_sum_fields: Collection_Sum_Fields;
  collection_var_pop_fields: Collection_Var_Pop_Fields;
  collection_var_samp_fields: Collection_Var_Samp_Fields;
  collection_variance_fields: Collection_Variance_Fields;
  mutation_root: {};
  numeric: Scalars['numeric'];
  numeric_comparison_exp: Numeric_Comparison_Exp;
  query_root: {};
  subscription_root: {};
  timestamptz: Scalars['timestamptz'];
  timestamptz_comparison_exp: Timestamptz_Comparison_Exp;
};

export type CachedDirectiveArgs = {
  refresh?: Scalars['Boolean'];
  ttl?: Scalars['Int'];
};

export type CachedDirectiveResolver<Result, Parent, ContextType = any, Args = CachedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection'] = ResolversParentTypes['collection']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['timestamptz'], ParentType, ContextType>;
  floorPrice?: Resolver<ResolversTypes['numeric'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profitThreshold?: Resolver<ResolversTypes['numeric'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  twitterUsername?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['timestamptz'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_AggregateResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_aggregate'] = ResolversParentTypes['collection_aggregate']> = {
  aggregate?: Resolver<Maybe<ResolversTypes['collection_aggregate_fields']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['collection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Aggregate_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_aggregate_fields'] = ResolversParentTypes['collection_aggregate_fields']> = {
  avg?: Resolver<Maybe<ResolversTypes['collection_avg_fields']>, ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<Collection_Aggregate_FieldsCountArgs, never>>;
  max?: Resolver<Maybe<ResolversTypes['collection_max_fields']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['collection_min_fields']>, ParentType, ContextType>;
  stddev?: Resolver<Maybe<ResolversTypes['collection_stddev_fields']>, ParentType, ContextType>;
  stddev_pop?: Resolver<Maybe<ResolversTypes['collection_stddev_pop_fields']>, ParentType, ContextType>;
  stddev_samp?: Resolver<Maybe<ResolversTypes['collection_stddev_samp_fields']>, ParentType, ContextType>;
  sum?: Resolver<Maybe<ResolversTypes['collection_sum_fields']>, ParentType, ContextType>;
  var_pop?: Resolver<Maybe<ResolversTypes['collection_var_pop_fields']>, ParentType, ContextType>;
  var_samp?: Resolver<Maybe<ResolversTypes['collection_var_samp_fields']>, ParentType, ContextType>;
  variance?: Resolver<Maybe<ResolversTypes['collection_variance_fields']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Avg_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_avg_fields'] = ResolversParentTypes['collection_avg_fields']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Max_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_max_fields'] = ResolversParentTypes['collection_max_fields']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['timestamptz']>, ParentType, ContextType>;
  floorPrice?: Resolver<Maybe<ResolversTypes['numeric']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['numeric']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitterUsername?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['timestamptz']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Min_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_min_fields'] = ResolversParentTypes['collection_min_fields']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  created_at?: Resolver<Maybe<ResolversTypes['timestamptz']>, ParentType, ContextType>;
  floorPrice?: Resolver<Maybe<ResolversTypes['numeric']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['numeric']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitterUsername?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updated_at?: Resolver<Maybe<ResolversTypes['timestamptz']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Mutation_ResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_mutation_response'] = ResolversParentTypes['collection_mutation_response']> = {
  affected_rows?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  returning?: Resolver<Array<ResolversTypes['collection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Stddev_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_stddev_fields'] = ResolversParentTypes['collection_stddev_fields']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Stddev_Pop_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_stddev_pop_fields'] = ResolversParentTypes['collection_stddev_pop_fields']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Stddev_Samp_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_stddev_samp_fields'] = ResolversParentTypes['collection_stddev_samp_fields']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Sum_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_sum_fields'] = ResolversParentTypes['collection_sum_fields']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['numeric']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['numeric']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Var_Pop_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_var_pop_fields'] = ResolversParentTypes['collection_var_pop_fields']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Var_Samp_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_var_samp_fields'] = ResolversParentTypes['collection_var_samp_fields']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Collection_Variance_FieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['collection_variance_fields'] = ResolversParentTypes['collection_variance_fields']> = {
  floorPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  profitThreshold?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Mutation_RootResolvers<ContextType = any, ParentType extends ResolversParentTypes['mutation_root'] = ResolversParentTypes['mutation_root']> = {
  delete_collection?: Resolver<Maybe<ResolversTypes['collection_mutation_response']>, ParentType, ContextType, RequireFields<Mutation_RootDelete_CollectionArgs, 'where'>>;
  delete_collection_by_pk?: Resolver<Maybe<ResolversTypes['collection']>, ParentType, ContextType, RequireFields<Mutation_RootDelete_Collection_By_PkArgs, 'address'>>;
  insert_collection?: Resolver<Maybe<ResolversTypes['collection_mutation_response']>, ParentType, ContextType, RequireFields<Mutation_RootInsert_CollectionArgs, 'objects'>>;
  insert_collection_one?: Resolver<Maybe<ResolversTypes['collection']>, ParentType, ContextType, RequireFields<Mutation_RootInsert_Collection_OneArgs, 'object'>>;
  update_collection?: Resolver<Maybe<ResolversTypes['collection_mutation_response']>, ParentType, ContextType, RequireFields<Mutation_RootUpdate_CollectionArgs, 'where'>>;
  update_collection_by_pk?: Resolver<Maybe<ResolversTypes['collection']>, ParentType, ContextType, RequireFields<Mutation_RootUpdate_Collection_By_PkArgs, 'pk_columns'>>;
};

export interface NumericScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['numeric'], any> {
  name: 'numeric';
}

export type Query_RootResolvers<ContextType = any, ParentType extends ResolversParentTypes['query_root'] = ResolversParentTypes['query_root']> = {
  collection?: Resolver<Array<ResolversTypes['collection']>, ParentType, ContextType, RequireFields<Query_RootCollectionArgs, never>>;
  collection_aggregate?: Resolver<ResolversTypes['collection_aggregate'], ParentType, ContextType, RequireFields<Query_RootCollection_AggregateArgs, never>>;
  collection_by_pk?: Resolver<Maybe<ResolversTypes['collection']>, ParentType, ContextType, RequireFields<Query_RootCollection_By_PkArgs, 'address'>>;
};

export type Subscription_RootResolvers<ContextType = any, ParentType extends ResolversParentTypes['subscription_root'] = ResolversParentTypes['subscription_root']> = {
  collection?: SubscriptionResolver<Array<ResolversTypes['collection']>, "collection", ParentType, ContextType, RequireFields<Subscription_RootCollectionArgs, never>>;
  collection_aggregate?: SubscriptionResolver<ResolversTypes['collection_aggregate'], "collection_aggregate", ParentType, ContextType, RequireFields<Subscription_RootCollection_AggregateArgs, never>>;
  collection_by_pk?: SubscriptionResolver<Maybe<ResolversTypes['collection']>, "collection_by_pk", ParentType, ContextType, RequireFields<Subscription_RootCollection_By_PkArgs, 'address'>>;
};

export interface TimestamptzScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['timestamptz'], any> {
  name: 'timestamptz';
}

export type Resolvers<ContextType = any> = {
  collection?: CollectionResolvers<ContextType>;
  collection_aggregate?: Collection_AggregateResolvers<ContextType>;
  collection_aggregate_fields?: Collection_Aggregate_FieldsResolvers<ContextType>;
  collection_avg_fields?: Collection_Avg_FieldsResolvers<ContextType>;
  collection_max_fields?: Collection_Max_FieldsResolvers<ContextType>;
  collection_min_fields?: Collection_Min_FieldsResolvers<ContextType>;
  collection_mutation_response?: Collection_Mutation_ResponseResolvers<ContextType>;
  collection_stddev_fields?: Collection_Stddev_FieldsResolvers<ContextType>;
  collection_stddev_pop_fields?: Collection_Stddev_Pop_FieldsResolvers<ContextType>;
  collection_stddev_samp_fields?: Collection_Stddev_Samp_FieldsResolvers<ContextType>;
  collection_sum_fields?: Collection_Sum_FieldsResolvers<ContextType>;
  collection_var_pop_fields?: Collection_Var_Pop_FieldsResolvers<ContextType>;
  collection_var_samp_fields?: Collection_Var_Samp_FieldsResolvers<ContextType>;
  collection_variance_fields?: Collection_Variance_FieldsResolvers<ContextType>;
  mutation_root?: Mutation_RootResolvers<ContextType>;
  numeric?: GraphQLScalarType;
  query_root?: Query_RootResolvers<ContextType>;
  subscription_root?: Subscription_RootResolvers<ContextType>;
  timestamptz?: GraphQLScalarType;
};

export type DirectiveResolvers<ContextType = any> = {
  cached?: CachedDirectiveResolver<any, any, ContextType>;
};
