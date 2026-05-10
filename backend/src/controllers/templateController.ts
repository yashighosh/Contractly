import { Request, Response } from 'express';
import Template from '../models/Template';

export const createTemplate = async (req: any, res: Response) => {
  try {
    const template = await Template.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Template created', data: template });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listTemplates = async (req: any, res: Response) => {
  try {
    const templates = await Template.find({ 
      $or: [
        { userId: req.user._id },
        { isPublic: true }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: templates });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTemplateById = async (req: any, res: Response) => {
  try {
    const template = await Template.findOne({ 
      _id: req.params.id, 
      $or: [
        { userId: req.user._id },
        { isPublic: true }
      ]
    });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTemplate = async (req: any, res: Response) => {
  try {
    const template = await Template.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, message: 'Template updated', data: template });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTemplate = async (req: any, res: Response) => {
  try {
    const template = await Template.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!template) {
      return res.status(404).json({ success: false, message: 'Template not found' });
    }
    res.json({ success: true, message: 'Template deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
