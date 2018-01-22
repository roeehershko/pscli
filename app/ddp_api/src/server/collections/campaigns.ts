import { MongoObservable } from 'meteor-rxjs';
import {Campaign} from 'models/campaigns';

export const Campaigns = new MongoObservable.Collection<Campaign>('campaigns');