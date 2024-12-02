import { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

const Filter: (slug: string, label: string) => CollectionConfig = (slug, label) => {
  return {
    slug,
    access: {
      create: isAdmin,
      read: () => true,
      update: isAdmin,
      delete: isAdmin,
    },
    admin: {
      group: 'Partner Program',
      useAsTitle: 'name',
    },
    fields: [
      {
        name: 'name',
        label: label + ' Label',
        type: 'text',
        required: true,
        unique: true,
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        required: true,
        unique: true,
        admin: {
          description: 'Must contain only lowercase letters, numbers, hyphens, and underscores',
        },
      },
    ],
  }
}

export const Specialties = Filter('specialties', 'Specialty')
export const Industries = Filter('industries', 'Industry')
export const Regions = Filter('regions', 'Region')
export const Budgets = Filter('budgets', 'Budget')
