import { Request, Response } from 'express';
import Clause from '../models/Clause';

export const createClause = async (req: any, res: Response) => {
  try {
    const clause = await Clause.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Clause created', data: clause });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listClauses = async (req: any, res: Response) => {
  try {
    const clauses = await Clause.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: clauses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClauseById = async (req: any, res: Response) => {
  try {
    const clause = await Clause.findOne({ _id: req.params.id, userId: req.user._id });
    if (!clause) {
      return res.status(404).json({ success: false, message: 'Clause not found' });
    }
    res.json({ success: true, data: clause });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClause = async (req: any, res: Response) => {
  try {
    const clause = await Clause.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!clause) {
      return res.status(404).json({ success: false, message: 'Clause not found' });
    }
    res.json({ success: true, message: 'Clause updated', data: clause });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClause = async (req: any, res: Response) => {
  try {
    const clause = await Clause.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!clause) {
      return res.status(404).json({ success: false, message: 'Clause not found' });
    }
    res.json({ success: true, message: 'Clause deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
