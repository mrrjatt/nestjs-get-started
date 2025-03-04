export const Genders = {
  MALE: 'Male',
  FEMALE: 'Female',
};

export const QueueNames = {
  EMAIL_QUEUE: 'email-queue',
  SMS_QUEUE: 'sms-queue',
  NOTIFICATIONS_QUEUE: 'notifications-queue',
};

export const EmailTemplates = {
  CONFIRM_ACCOUNT: 'confirm-email',
  RESET_PASSWORD: 'reset-password',
  CONTACT_US: 'contact-us-email',
};

export enum Role {
  User = 'user',
  Admin = 'admin',
}
export enum AUTH_PROVIDERS {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

export const providerFieldNames = {
  google: {
    providerId: 'sub',
    email: 'email',
    picture: 'picture',
    name: 'name',
  },
  facebook: {
    providerId: 'id',
    email: 'email_address',
    picture: 'profile_image',
  },
};

export enum JOB_NAMES {
  FOLLOWED = 'followed',
  COMMUNITY_POST_REACTION = 'communiy-post-reaction',
  POST_REACTION = 'post-reaction',
  COMMUNITY_POST_COMMENT = 'community-post-comment',
  REEL_PR = 'reel-pr',
}

export enum NOTIFICATIONS_TYPE {
  FOLLOWED = 'followed',
  COMMUNITY_POST_REACTION = 'communiy-post-reaction',
  POST_REACTION = 'post-reaction',
  COMMUNITY_POST_COMMENT = 'community-post-comment',
  REEL_PR = 'reel-pr',
}

export enum SearchType {
  USERS = 'users',
  POSTS = 'posts',
  REELS = 'reels',
}