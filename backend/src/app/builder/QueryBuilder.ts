import { FilterQuery, Query, Types } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[], numericFields: string[] = []) {
    const searchTerm = this.query.search as string;
    if (searchTerm) {
      const searchConditions = searchableFields
        .map((field) => {
          // Handle numeric fields (like studentId)
          if (numericFields.includes(field)) {
            // If search term is a valid number, search for exact match
            if (!isNaN(Number(searchTerm))) {
              return { [field]: Number(searchTerm) } as FilterQuery<T>;
            }
            // If not a number, skip this field for numeric search
            return null;
          }

          // Handle string fields with regex
          return {
            [field]: { $regex: searchTerm, $options: 'i' },
          } as FilterQuery<T>;
        })
        .filter((condition): condition is FilterQuery<T> => condition !== null); // Remove null values with type guard

      if (searchConditions.length > 0) {
        this.modelQuery = this.modelQuery.find({
          $or: searchConditions as FilterQuery<T>[],
        });
      }
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = [
      'search',
      'sortBy',
      'sortOrder',
      'page',
      'limit',
      'fields',
    ];

    excludeFields.forEach((field) => delete queryObj[field]);

    const filterQuery: FilterQuery<T> = {};

    if (queryObj.lmugoals) {
      const lmugoalsIds = (queryObj.lmugoals as string)
        .split(',')
        .map((id) => new Types.ObjectId(id));
      (filterQuery as Record<string, unknown>)['lmugoals'] = {
        $in: lmugoalsIds,
      };
    }

    // Add status filtering
    if (queryObj.status) {
      const statuses = String(queryObj.status)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      // if "all" is present, don't add any status filter
      if (!statuses.includes('all')) {
        (filterQuery as Record<string, unknown>)['status'] =
          statuses.length > 1 ? { $in: statuses } : statuses[0];
      }
    }

    // Add type filtering
    if (queryObj.type) {
      (filterQuery as Record<string, unknown>)['type'] = queryObj.type;
    }

    // Apply the filter to the query
    if (Object.keys(filterQuery).length > 0) {
      this.modelQuery = this.modelQuery.find(filterQuery);
    }

    return this;
  }

  sort() {
    const sortBy = (this.query.sortBy as string) || 'updatedAt';
    const sortOrder = (this.query.sortOrder as string) === 'asc' ? 1 : -1;
    this.modelQuery = this.modelQuery.sort({ [sortBy]: sortOrder });
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields = (this.query.fields as string)?.split(',')?.join(' ');
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  sortByCreatedAt(order: 'asc' | 'desc' = 'desc') {
    this.modelQuery = this.modelQuery.sort({
      createdAt: order === 'asc' ? 1 : -1,
    });
    return this;
  }
}

export default QueryBuilder;
