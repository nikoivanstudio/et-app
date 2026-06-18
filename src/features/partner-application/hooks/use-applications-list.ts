import { useQuery } from '@tanstack/react-query';

import { partnerApplicationApi } from '../api/partner-application-api';
import { GetApplicationsResponse } from '../domain';

export const useApplicationsList = () => {
  const { data, isLoading, isFetching, error } = useQuery({
    ...partnerApplicationApi.getApplicationsQueryOption<GetApplicationsResponse>()
  });

  return { data, isLoading, isFetching, error };
};
