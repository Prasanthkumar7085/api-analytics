export class PaginationHelper {
    getTotalNumberOfPages(count: number, limit: any): number {
      let totalPages = 0
      if (count) {
        totalPages = (limit && Math.ceil(count / limit)) || 1
      }
      return totalPages
    }
  
    getHasMore(skip: any, dataLength: any, count: any): boolean {
      let hasMore = false
      if (skip !== undefined && skip !== null) {
        hasMore = skip + dataLength < count
      }
      return hasMore
    }
  
    getPaginationResponse({
      page = 1,
      count,
      limit = 10,
      skip,
      data = [],
      data_field = "data",
      message,
      searchString = null,
    }): Object {
      const hasMore = this.getHasMore(skip, data.length, count)
      const totalPages = this.getTotalNumberOfPages(count, limit)
      return {
        has_more: hasMore,
        total: count,
        page,
        limit: limit || 0,
        total_pages: totalPages,
        success: true,
        message,
        search_string: searchString,
        [data_field]: data,
      }
    }
  }
  