// utils/responseMessage.js
export const responseMessage = {
  notFound: (model) => `${model} not found`,
  created: (model) => `${model} created successfully`,
  updated: (model) => `${model} updated successfully`,
  deleted: (model) => `${model} deleted successfully`,
  fetched: (model) => `${model} fetched successfully`,
  statusUpdated: (model) => `${model} status updated successfully`,
  alreadyExists: (model) => `${model} with this name already exists`,
  failed: (model) => `${model} operation failed`,
  required: (model) => `${model} required`,
};
