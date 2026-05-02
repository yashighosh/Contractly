import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractService } from '../services/contractService';
import { toast } from 'react-hot-toast';

export function useContracts(params = {}) {
  return useQuery({
    queryKey: ['contracts', params],
    queryFn: () => contractService.getAll(params).then((r) => r.data),
  });
}

export function useContract(id) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: () => contractService.getById(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => contractService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract created!');
    },
    onError: () => toast.error('Failed to create contract'),
  });
}

export function useUpdateContract(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => contractService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contracts'] });
      qc.invalidateQueries({ queryKey: ['contract', id] });
      toast.success('Contract updated!');
    },
    onError: () => toast.error('Failed to update contract'),
  });
}

export function useDeleteContract() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => contractService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract deleted');
    },
    onError: () => toast.error('Failed to delete contract'),
  });
}

export function useSendContract(id) {
  return useMutation({
    mutationFn: (payload) => contractService.send(id, payload),
    onSuccess: () => toast.success('Contract sent!'),
    onError: () => toast.error('Failed to send contract'),
  });
}
