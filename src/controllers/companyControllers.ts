import { Request, Response } from 'express';
import axios from 'axios';
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

    const verifyExistingCompany = await Company.findOne({ name });

    if (verifyExistingCompany) {
      return response
        .status(400)
        .json({ message: 'Company already registered' });
    }

    if (description?.length > 140) {
      return response.status(400).json({
        message: 'Description must have up to 140 characters',
      });
    }

    const newCompany = {
      name,
      description,
      type,
      location,
    };

    if (!description) {
      delete newCompany.description;
    }

    try {
      if (!location.state || !location.country) {
        const responseFromGeoNames = await axios.get(
          'http://api.geonames.org/searchJSON',
          {
            params: {
              username: process.env.USERNAME_GEO_NAMES,
              type: 'json',
              maxRows: 10,
              featureClass: 'P',
              q: location.city,
            },
          },
        );
        const arrayLengthLocations = responseFromGeoNames.data.geonames.length;

        if (arrayLengthLocations !== 1) {
          return response
            .status(400)
            .json({ message: 'Please, provide a valid location' });
        }

        const city = responseFromGeoNames.data.geonames[0].name;
        const state =
          responseFromGeoNames.data.geonames[0].adminCodes1.ISO3166_2;
        const country = responseFromGeoNames.data.geonames[0].countryName;

        newCompany.location = { city, state, country };
      }

      const responseFromDb = await Company.create(newCompany);

      return response.status(201).json({ responseFromDb });
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'Error to register company' });
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

  public async update(request: Request, response: Response): Promise<Response> {
    const companyId = request.params.id;
    const { type, location } = request.body;

    const updatedCompany = {
      type,
      location,
    };

    try {
      if (!location.state || !location.country) {
        const responseFromGeoNames = await axios.get(
          'https://api.geonames.org/searchJSON',
          {
            params: {
              username: process.env.USERNAME_GEO_NAMES,
              type: 'json',
              maxRows: 10,
              featureClass: 'P',
              q: location.city,
            },
          },
        );
        const arrayLengthLocations = responseFromGeoNames.data.geonames.length;

        if (arrayLengthLocations !== 1) {
          return response
            .status(400)
            .json({ message: 'Please, provide a valid location' });
        }

        const city = responseFromGeoNames.data.geonames[0].name;
        const state =
          responseFromGeoNames.data.geonames[0].adminCodes1.ISO3166_2;
        const country = responseFromGeoNames.data.geonames[0].countryName;

        updatedCompany.location = { city, state, country };
      }

      const responseFromDb = await Company.findByIdAndUpdate(
        companyId,
        updatedCompany,
        {
          new: true,
        },
      );

      return response.status(200).json(responseFromDb);
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Request failed, please try again' });
    }
  }

  public async updateActivity(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.user;
    const companyId = request.params.id;

    try {
      const currentCompany = await Company.findById(companyId);

      if (!currentCompany) {
        return response
          .status(400)
          .json({ message: 'The company was not found' });
      }

      if (currentCompany.votesForInactivity?.includes(id)) {
        return response
          .status(406)
          .json({ message: 'User already voted for inactivity' });
      }

      let responseFromDb = await Company.findByIdAndUpdate(
        companyId,
        { $push: { votesForInactivity: id } },
        {
          new: true,
        },
      );

      if (responseFromDb?.votesForInactivity?.length === 5) {
        responseFromDb = await Company.findByIdAndUpdate(
          companyId,
          {
            isActive: false,
          },
          {
            new: true,
          },
        );
      }

      return response.status(200).json(responseFromDb);
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Request failed, please try again' });
    }
  }
}
