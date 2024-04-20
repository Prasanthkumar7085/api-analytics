import { IsNotEmpty } from 'class-validator';

export class UpdateSalesRepTargetsDto {

    @IsNotEmpty({ message: 'Covid volume is required' })
    covid: number;

    @IsNotEmpty({ message: 'Covid Flu is required' })
    covid_flu: number;

    @IsNotEmpty({ message: 'Clinical Volume is required' })
    clinical: number;

    @IsNotEmpty({ message: 'Gastro Volume is required' })
    gastro: number;

    @IsNotEmpty({ message: 'Nail Volume is required' })
    nail: number;

    @IsNotEmpty({ message: 'Pgx Volume is required' })
    pgx: number;

    @IsNotEmpty({ message: 'Rpp volume is required' })
    rpp: number;

    @IsNotEmpty({ message: 'Tox volume is required' })
    tox: number;

    @IsNotEmpty({ message: 'Ua volume is required' })
    ua: number;

    @IsNotEmpty({ message: 'Uti volume is required' })
    uti: number;

    @IsNotEmpty({ message: 'Wound volume is required' })
    wound: number;

    @IsNotEmpty({ message: 'Card volume is required' })
    card: number;

    @IsNotEmpty({ message: 'Cgx volume is required' })
    cgx: number;

    @IsNotEmpty({ message: 'Diabetes volume is required' })
    diabetes: number;

    @IsNotEmpty({ message: 'Pad volume is required' })
    pad: number;

    @IsNotEmpty({ message: 'Pul volume is required' })
    pul: number;

}
