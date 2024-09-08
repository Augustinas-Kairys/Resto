import { Request, Response } from 'express';
import Table from '../models/Table';

export const createTable = async (req: Request, res: Response) => {
  try {
    const newTable = new Table(req.body);
    await newTable.save();
    res.status(201).json(newTable);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const getTables = async (req: Request, res: Response) => {
  try {
    const tables = await Table.find({});
    res.status(200).json(tables);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const getTableById = async (req: Request, res: Response) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json(table);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const updatedTable = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json(updatedTable);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const deletedTable = await Table.findByIdAndDelete(req.params.id);
    if (!deletedTable) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};