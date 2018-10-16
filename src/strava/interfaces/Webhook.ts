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

export default interface Webhook {
  objectType: ObjectType;
  objectId: number;
  aspectType: AspectType;
  updates: UpdateActivity | UpdateDeauthorization;
  ownerId: number;
  subcriptionId: number;
  eventTime: number;
}
