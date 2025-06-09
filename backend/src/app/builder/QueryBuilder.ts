import { FilterQuery, Query, Types } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.search as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
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
  }

  sort() {
    const sortBy = (this.query.sortBy as string) || 'updatedAt';
    const sortOrder = (this.query.sortOrder as string) || 'desc';
    const sortString = `${sortOrder}${sortBy}`;
    this.modelQuery = this.modelQuery.sort(sortString);
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
}

export default QueryBuilder;
