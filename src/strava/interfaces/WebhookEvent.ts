import AspectType from './AspectType';
import ObjectType from './ObjectType';

interface UpdateActivity {
  title?: string;
  type?: string;
  private?: boolean;
}

interface UpdateDeauthorization {
  authroized: false;
}

interface BaseWebhook {
  objectType: ObjectType;
  objectId: number;
  aspectType: AspectType;
  updates: UpdateActivity | UpdateDeauthorization;
  ownerId: number;
  subscriptionId: number;
  eventTime: number | string;
}

export interface StravaWebhookEvent extends BaseWebhook {
  eventTime: number; // seconds
}

export default interface WebhookEvent extends BaseWebhook {
  eventTime: string; // ISO8601
}
