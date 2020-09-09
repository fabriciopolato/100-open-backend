import { Request, Response } from 'express';
import { companyFields } from '../utils/requiredFields';
import Company from '../models/Company';

export default class CompanyController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, description, type, location } = request.body;

    for (const field of companyFields) {
      if (!request.body[field]) {
        return response.status(400).json({
          message: `Missing ${field} field`,
        });
      }

      if (typeof request.body[field] !== 'string') {
        return response.status(400).json({
          message: `${field} must be a string`,
        });
      }
    }

    if (description?.length > 140) {
      return response.status(400).json({
        message: 'Description must have up to 140 characters',
      });
    }

    try {
      const verifyExistingCompany = await Company.findOne({ name });

      if (verifyExistingCompany) {
        return response
          .status(400)
          .json({ message: 'Company already registered' });
      }

      const newCompany = {
        name,
        description,
        type,
        // location,
      };

      if (!description) {
        delete newCompany.description;
      }

      const responseFromDb = await Company.create(newCompany);

      return response.status(201).json({ responseFromDb });
    } catch (error) {
      console.log(error);
      return response
        .status(500)
        .json({ message: 'Failed to register company' });
    }
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { name } = request.query;

    if (typeof name !== 'string') {
      return response.status(400).json({ message: 'Invalid name type' });
    }

    try {
      const company = await Company.find({
        name: { $regex: name, $options: 'gi' },
      });

      if (!company.length) {
        return response.status(400).json({
          message: 'No company found',
        });
      }

      return response.status(200).json(company);
    } catch (error) {
      return response.status(500).json({
        message: 'Request failed, please try again',
      });
    }
  }
}