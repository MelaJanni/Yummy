const buildPagination = (items, total, cursor, limit) => {
  const hasMore = items.length > limit;
  const paginatedItems = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? paginatedItems[paginatedItems.length - 1].id : null;

  const currentPage = cursor ? Math.floor((total - cursor) / limit) + 1 : 1;
  const lastPage = Math.ceil(total / limit);
  const from = cursor ? total - cursor + 1 : 1;
  const to = cursor ? Math.min(total - cursor + limit, total) : Math.min(limit, total);

  return {
    items: paginatedItems,
    pagination: {
      total,
      perPage: limit,
      currentPage,
      lastPage,
      from,
      to,
      hasMore,
      nextCursor
    }
  };
};

module.exports = {
  buildPagination
};
