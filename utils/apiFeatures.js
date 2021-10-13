class APIFEATURES {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    //Build Query
    //1a.)Filtering
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //1b.)Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/gte|gt|lt|lte/g, (str) => {
        return `$${str}`;
      })
    );
    //Execute the query
    this.query = this.query.find(queryStr);
    return this;
  }

  sort() {
    //2.)Sorting
    if (this.queryStr.sort) {
      console.log(this.queryStr.sort);
      const sortStr = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortStr);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    //3.)Limit fields
    if (this.queryStr.fields) {
      const field = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(field);
    } else {
      this.query = this.query.select("title organisation.name location.Country location.State Skillset ");
    }
    return this;
  }
  paginate() {
    //4.)Pagination
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 6;
    const skip = (page - 1) * limit; //number of documents to skip
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFEATURES;
