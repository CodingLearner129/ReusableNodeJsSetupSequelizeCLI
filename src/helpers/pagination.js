export const getPagination = (page, size) => {
    try {
        const limit = size ? +size : 3;
        const offset = page ? (page - 1) * limit : 0;
        return { limit, offset };
    } catch (error) {
        throw error;
    }
};

export const getPagingData = (dataWithCount, page, limit) => {
    try {
        const { count: totalResult, rows: result } = dataWithCount;
        const currentPage = page ? +page : 0;
        const pageCount = Math.ceil(totalResult / limit);
        let nextPage = currentPage + 1;
        let hasNextPage = true;
        if (pageCount < nextPage) {
            hasNextPage = false; // means no more pages found
        }
        return { totalResult, result, pageCount, currentPage, hasNextPage };
    } catch (error) {
        throw error;
    }
};
