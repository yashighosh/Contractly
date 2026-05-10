import { Request, Response } from 'express';
import Client from '../models/Client';

export const createClient = async (req: any, res: Response) => {
  try {
    const client = await Client.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Client created', data: client });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listClients = async (req: any, res: Response) => {
  try {
    const clients = await Client.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: clients });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClientById = async (req: any, res: Response) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, data: client });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClient = async (req: any, res: Response) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, message: 'Client updated', data: client });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClient = async (req: any, res: Response) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, message: 'Client deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
