import {
  CollectionTypeSchema,
  StringAttribute,
  RequiredAttribute,
  SetMinMaxLength,
  JSONAttribute,
  DefaultTo,
  RelationAttribute,
  DateTimeAttribute,
  PrivateAttribute,
  EmailAttribute,
  UniqueAttribute,
  PasswordAttribute,
  BooleanAttribute,
  EnumerationAttribute,
  IntegerAttribute,
  DecimalAttribute,
  SetMinMax,
  TextAttribute,
  MediaAttribute,
  FloatAttribute,
  DateAttribute,
  TimeAttribute,
  UIDAttribute,
  ComponentSchema,
} from '@strapi/strapi';

export interface AdminPermission extends CollectionTypeSchema {
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    subject: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: JSONAttribute & DefaultTo<{}>;
    conditions: JSONAttribute & DefaultTo<[]>;
    role: RelationAttribute<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminUser extends CollectionTypeSchema {
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    username: StringAttribute;
    email: EmailAttribute &
      RequiredAttribute &
      PrivateAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    registrationToken: StringAttribute & PrivateAttribute;
    isActive: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    roles: RelationAttribute<'admin::user', 'manyToMany', 'admin::role'> &
      PrivateAttribute;
    blocked: BooleanAttribute & PrivateAttribute & DefaultTo<false>;
    preferedLanguage: StringAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::user', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminRole extends CollectionTypeSchema {
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    code: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute;
    users: RelationAttribute<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: RelationAttribute<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'admin::role', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface AdminApiToken extends CollectionTypeSchema {
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    description: StringAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }> &
      DefaultTo<''>;
    type: EnumerationAttribute<['read-only', 'full-access', 'custom']> &
      RequiredAttribute &
      DefaultTo<'read-only'>;
    accessKey: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: DateTimeAttribute;
    permissions: RelationAttribute<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: DateTimeAttribute;
    lifespan: IntegerAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AdminApiTokenPermission extends CollectionTypeSchema {
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 1;
      }>;
    token: RelationAttribute<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface ApiParkPark extends CollectionTypeSchema {
  info: {
    singularName: 'park';
    pluralName: 'parks';
    displayName: 'Park';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    distance: DecimalAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }> &
      DefaultTo<5>;
    name: StringAttribute & RequiredAttribute & UniqueAttribute;
    geolocalisation: TextAttribute;
    itinerary: MediaAttribute;
    laps: FloatAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    gallery: MediaAttribute;
    races: RelationAttribute<'api::park.park', 'oneToMany', 'api::race.race'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::park.park', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::park.park', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiRaceRace extends CollectionTypeSchema {
  info: {
    singularName: 'race';
    pluralName: 'races';
    displayName: 'Race';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    startDate: DateAttribute & RequiredAttribute & UniqueAttribute;
    park: RelationAttribute<'api::race.race', 'manyToOne', 'api::park.park'>;
    runs: RelationAttribute<'api::race.race', 'oneToMany', 'api::run.run'>;
    startTime: TimeAttribute & RequiredAttribute & DefaultTo<'10:00'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    publishedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::race.race', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::race.race', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiRunRun extends CollectionTypeSchema {
  info: {
    singularName: 'run';
    pluralName: 'runs';
    displayName: 'Run';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    chrono: StringAttribute;
    numberSign: IntegerAttribute &
      SetMinMax<{
        min: 1;
        max: 100;
      }>;
    walking: BooleanAttribute & DefaultTo<false>;
    copyright: BooleanAttribute & DefaultTo<true>;
    runner: RelationAttribute<
      'api::run.run',
      'manyToOne',
      'api::runner.runner'
    >;
    dropped: BooleanAttribute & DefaultTo<false>;
    race: RelationAttribute<'api::run.run', 'manyToOne', 'api::race.race'>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<'api::run.run', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
    updatedBy: RelationAttribute<'api::run.run', 'oneToOne', 'admin::user'> &
      PrivateAttribute;
  };
}

export interface ApiRunnerRunner extends CollectionTypeSchema {
  info: {
    singularName: 'runner';
    pluralName: 'runners';
    displayName: 'Runner';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    firstname: StringAttribute & RequiredAttribute;
    lastname: StringAttribute & RequiredAttribute;
    blocked: BooleanAttribute & DefaultTo<false>;
    children: RelationAttribute<
      'api::runner.runner',
      'oneToMany',
      'api::runner.runner'
    >;
    parent: RelationAttribute<
      'api::runner.runner',
      'manyToOne',
      'api::runner.runner'
    >;
    runs: RelationAttribute<'api::runner.runner', 'oneToMany', 'api::run.run'>;
    email: EmailAttribute;
    minor: BooleanAttribute & DefaultTo<false>;
    child: BooleanAttribute & DefaultTo<false>;
    fullname: StringAttribute & UniqueAttribute;
    attachments: MediaAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'api::runner.runner',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'api::runner.runner',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFile extends CollectionTypeSchema {
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'Media';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: true;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute & RequiredAttribute;
    alternativeText: StringAttribute;
    caption: StringAttribute;
    width: IntegerAttribute;
    height: IntegerAttribute;
    formats: JSONAttribute;
    hash: StringAttribute & RequiredAttribute;
    ext: StringAttribute;
    mime: StringAttribute & RequiredAttribute;
    size: DecimalAttribute & RequiredAttribute;
    url: StringAttribute & RequiredAttribute;
    previewUrl: StringAttribute;
    provider: StringAttribute & RequiredAttribute;
    provider_metadata: JSONAttribute;
    related: RelationAttribute<'plugin::upload.file', 'morphToMany'>;
    folder: RelationAttribute<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      PrivateAttribute;
    folderPath: StringAttribute &
      RequiredAttribute &
      PrivateAttribute &
      SetMinMax<{
        min: 1;
      }>;
    valid: BooleanAttribute;
    expiredAt: DateTimeAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUploadFolder extends CollectionTypeSchema {
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    pathId: IntegerAttribute & RequiredAttribute & UniqueAttribute;
    parent: RelationAttribute<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: RelationAttribute<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginStrapiStripeStrapiStripeProduct
  extends CollectionTypeSchema {
  info: {
    tableName: 'StrapiStripeProduct';
    singularName: 'strapi-stripe-product';
    pluralName: 'strapi-stripe-products';
    displayName: 'Product';
    description: 'Stripe Products';
    kind: 'collectionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    title: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    slug: UIDAttribute<'plugin::strapi-stripe.strapi-stripe-product', 'title'> &
      RequiredAttribute &
      UniqueAttribute;
    description: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    price: DecimalAttribute & RequiredAttribute;
    currency: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 1;
      }>;
    productImage: MediaAttribute & RequiredAttribute;
    isSubscription: BooleanAttribute & DefaultTo<false>;
    interval: StringAttribute;
    trialPeriodDays: IntegerAttribute;
    stripeProductId: StringAttribute &
      RequiredAttribute &
      SetMinMax<{
        min: 3;
      }>;
    stripePriceId: StringAttribute &
      SetMinMax<{
        min: 3;
      }>;
    stripePlanId: StringAttribute &
      SetMinMax<{
        min: 3;
      }>;
    stripePayment: RelationAttribute<
      'plugin::strapi-stripe.strapi-stripe-product',
      'oneToMany',
      'plugin::strapi-stripe.strapi-stripe-payment'
    >;
    isFreeAmount: BooleanAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::strapi-stripe.strapi-stripe-product',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::strapi-stripe.strapi-stripe-product',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginStrapiStripeStrapiStripePayment
  extends CollectionTypeSchema {
  info: {
    tableName: 'StrapiStripePayment';
    singularName: 'strapi-stripe-payment';
    pluralName: 'strapi-stripe-payments';
    displayName: 'Payment';
    description: 'Stripe Payment';
    kind: 'collectionType';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    txnDate: DateTimeAttribute & RequiredAttribute;
    transactionId: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        maxLength: 250;
      }>;
    isTxnSuccessful: BooleanAttribute & DefaultTo<false>;
    txnMessage: StringAttribute &
      SetMinMaxLength<{
        maxLength: 5000;
      }>;
    txnErrorMessage: StringAttribute &
      SetMinMaxLength<{
        maxLength: 250;
      }>;
    txnAmount: DecimalAttribute & RequiredAttribute;
    customerName: StringAttribute & RequiredAttribute;
    customerEmail: StringAttribute & RequiredAttribute;
    stripeProduct: RelationAttribute<
      'plugin::strapi-stripe.strapi-stripe-payment',
      'manyToOne',
      'plugin::strapi-stripe.strapi-stripe-product'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::strapi-stripe.strapi-stripe-payment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::strapi-stripe.strapi-stripe-payment',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginI18NLocale extends CollectionTypeSchema {
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: StringAttribute & UniqueAttribute;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsPermission extends CollectionTypeSchema {
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: StringAttribute & RequiredAttribute;
    role: RelationAttribute<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsRole extends CollectionTypeSchema {
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: StringAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    description: StringAttribute;
    type: StringAttribute & UniqueAttribute;
    permissions: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface PluginUsersPermissionsUser extends CollectionTypeSchema {
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: StringAttribute &
      RequiredAttribute &
      UniqueAttribute &
      SetMinMaxLength<{
        minLength: 3;
      }>;
    email: EmailAttribute &
      RequiredAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: StringAttribute;
    password: PasswordAttribute &
      PrivateAttribute &
      SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: StringAttribute & PrivateAttribute;
    confirmationToken: StringAttribute & PrivateAttribute;
    confirmed: BooleanAttribute & DefaultTo<false>;
    blocked: BooleanAttribute & DefaultTo<false>;
    role: RelationAttribute<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: DateTimeAttribute;
    updatedAt: DateTimeAttribute;
    createdBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
    updatedBy: RelationAttribute<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      PrivateAttribute;
  };
}

export interface AttachmentsAuthorization extends ComponentSchema {
  info: {
    displayName: 'Authorization';
    icon: 'user-check';
    description: '';
  };
  attributes: {
    file: MediaAttribute & RequiredAttribute;
    valid: BooleanAttribute & DefaultTo<false>;
  };
}

export interface AttachmentsCertificate extends ComponentSchema {
  info: {
    displayName: 'Certificate';
    icon: 'file-medical';
    description: '';
  };
  attributes: {
    file: MediaAttribute & RequiredAttribute;
    expiry: DateAttribute;
    valid: BooleanAttribute & DefaultTo<false>;
  };
}

declare global {
  namespace Strapi {
    interface Schemas {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'api::park.park': ApiParkPark;
      'api::race.race': ApiRaceRace;
      'api::run.run': ApiRunRun;
      'api::runner.runner': ApiRunnerRunner;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::strapi-stripe.strapi-stripe-product': PluginStrapiStripeStrapiStripeProduct;
      'plugin::strapi-stripe.strapi-stripe-payment': PluginStrapiStripeStrapiStripePayment;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'attachments.authorization': AttachmentsAuthorization;
      'attachments.certificate': AttachmentsCertificate;
    }
  }
}

export type GetModel<T extends Schema> = {
  id: number;
} & T["attributes"];
