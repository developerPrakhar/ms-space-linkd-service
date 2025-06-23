export const responseService = {
  formatSuccessResponse(message: string, data: any, status?: number) {
    return {
      ok: true,
      message,
      data,
      status,
    };
  },

  formatErrorResponse(message: string, data: any, status?: number) {
    return {
      ok: false,
      message,
      data,
      status,
    };
  },
};
