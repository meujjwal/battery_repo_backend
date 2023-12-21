import express, { Request, Response } from 'express';
import batterySchema, { IBattery } from '../models/batterySchema';

const router = express.Router();

async function getBatteries(req: Request, res: Response) {
  try {
    const { search } = req.query;
    const minPostCode = parseInt(req.query.minPostCode as string, 10);  
    const maxPostCode = parseInt(req.query.maxPostCode as string, 10);

    let query: any = {};
    if (!isNaN(minPostCode) && !isNaN(maxPostCode)) {
      query = {
        postCode: { $gte: minPostCode, $lte: maxPostCode },
      };
    }
    else if(!isNaN(minPostCode) && isNaN(maxPostCode)){
      query = {
        postCode: { $gte: minPostCode },
      };
    }
    else if(isNaN(minPostCode) && !isNaN(maxPostCode)){
      query = {
        postCode: { $lte: maxPostCode },
      };
    }
    // console.log(minPostCode, maxPostCode, search);
    if (minPostCode && maxPostCode) {
      query = {
        postCode: { $gte: (minPostCode), $lte: maxPostCode }, // Corrected property name
      };
    }
    // console.log(query);
    if (search) {
      query.name = {
        $regex: search.toString(),
        $options: 'i',
      };
    }
    const batteries = await batterySchema.find(query);
    // console.log(batteries);
    const batteries2 = await batterySchema.find(query).sort('name');

    const totalWattCapacity: number = batteries.reduce(
      (total, battery) => total + battery.wattCapacity,
      0
    );
    const averageWattCapacity: number =
      totalWattCapacity / batteries.length || 0;
    const length: number = batteries.length;

    res.status(200).json({
      batteries,
      statistics: {
        totalWattCapacity,
        averageWattCapacity,
        length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

router.get('/batteries', getBatteries);


async function postBatteries(req: Request, res: Response) {
  try {
    const { name, postCode, wattCapacity } = req.body;

    const newBattery: IBattery = new batterySchema({
      name,
      postCode,
      wattCapacity,
    });

    await newBattery.save();
    res.status(201).json({
      success: true,
      message: 'Battery Added Successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

router.post('/batteries', postBatteries);

async function updateBatteries(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, postCode, wattCapacity } = req.body;

    const updatedBattery = await batterySchema.findByIdAndUpdate(
      id,
      {
        name,
        postCode,
        wattCapacity,
      },
      {
        new: true,
      }
    );
    res.json(updatedBattery);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

router.put('/batteries/:id', updateBatteries);

async function deleteBatteries(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await batterySchema.findByIdAndDelete(id);
    res.json({
      success: true,
      message: 'Battery Deleted Successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

router.delete('/batteries/:id', deleteBatteries);


export default router;
