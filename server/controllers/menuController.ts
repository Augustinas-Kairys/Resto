import { Request, Response } from 'express';
import MenuItem from '../models/MenuItem';

import upload from '../config/multer'; 


const uploadSingle = upload.single('image');

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const newItem = new MenuItem({
        ...req.body,
        imageUrl: req.file ? req.file.filename : undefined 
      });
      await newItem.save();
      res.status(201).json(newItem);
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    uploadSingle(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, {
        ...req.body,
        imageUrl: req.file ? req.file.filename : undefined
      }, { new: true });
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json(updatedItem);
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};


export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const items = await MenuItem.find({});
    res.status(200).json(items);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const getMenuItemById = async (req: Request, res: Response) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};