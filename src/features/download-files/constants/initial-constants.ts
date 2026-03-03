import { FilesSearchParams, SearchState } from '../domain';

export const initialSearchState: SearchState = {
  value: ''
};

export const initialQueryParams: FilesSearchParams = {
  page: 1
};
