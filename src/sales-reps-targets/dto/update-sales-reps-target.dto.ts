import { IsNotEmpty } from 'class-validator';

export class UpdateSalesRepTargetsDto {

    @IsNotEmpty({ message: 'Target volume is required' })
    target_volume: number;

    @IsNotEmpty({ message: 'Target facilities is required' })
    target_facilities: number;

    @IsNotEmpty({ message: 'Year is required' })
    year: number;
    
    @IsNotEmpty({ message: 'Month is required' })
    month: string;
}
