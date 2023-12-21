import { Schema, Document, model } from 'mongoose';

export interface IBattery extends Document {
  name: string;
  postCode: number;
  wattCapacity: number;
}
const batterySchema:Schema = new Schema<IBattery>({
    name: {
      type: String,
      required: true,
    },
    postCode: {
      type: Number,
      required: true,
    },
    wattCapacity: {
      type: Number,
      required: true,
    },
  });
export default model<IBattery>('Battery', batterySchema);
