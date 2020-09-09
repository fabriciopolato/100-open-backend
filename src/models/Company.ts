import { Schema, Document, model } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  type: string;
  description?: string;
  location?: ILocation;
  isActive?: boolean;
  votesForInactivity?: string[];
}

interface ILocation {
  city: string;
  state: string;
  country: string;
}

const CompanySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    max: 140,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'AgriTech',
      'AutoTech',
      'BioTech',
      'CityTech',
      'CleanTech',
      'ConstruTech',
      'EdTech',
      'EnergyTechs',
      'FashionTech',
      'FinTech',
      'FoodTech',
      'GovTech',
      'HealthTech',
      'HRtech',
      'IndTech',
      'LegalTech',
      'LogTech',
      'MarTech',
      'RetailTech',
      'TravelTech',
    ],
  },
  location: {
    country: String,
    state: String,
    city: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  votesForInactivity: {
    type: [String],
    default: [],
  },
});

const Company = model<ICompany>('Company', CompanySchema);

export default Company;
