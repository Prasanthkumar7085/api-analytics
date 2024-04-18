import { IsNotEmpty } from 'class-validator';

export class UpdateSalesRepTargetsDto {

    @IsNotEmpty({ message: 'Targets data is required' })
    targets_data: number[];
    
    @IsNotEmpty({ message: 'Month is required' })
    month: string;
}
