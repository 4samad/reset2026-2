import { CheckInStatus } from '@/types';
import { FaFistRaised, FaSadTear } from 'react-icons/fa';
import { FaFaceLaughBeam } from 'react-icons/fa6';
import { IconType } from 'react-icons';

export interface CheckInOption {
  status: CheckInStatus;
  label: string;
  icon: IconType;
  bgColor: string;
  selectedBg: string;
}

export const CHECK_IN_OPTIONS: CheckInOption[] = [
  {
    status: 'strong',
    label: 'Strong',
    icon: FaFaceLaughBeam,
    bgColor: 'bg-base-200',
    selectedBg: 'bg-success',
  },
  {
    status: 'struggled',
    label: 'Struggled',
    icon: FaFistRaised,
    bgColor: 'bg-base-200',
    selectedBg: 'bg-warning',
  },
  {
    status: 'relapsed',
    label: 'Relapsed',
    icon: FaSadTear,
    bgColor: 'bg-base-200',
    selectedBg: 'bg-error',
  },
];
