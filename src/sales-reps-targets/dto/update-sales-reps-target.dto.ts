import { IsNotEmpty } from 'class-validator';

export class UpdateSalesRepTargetsDto {

    @IsNotEmpty({ message: 'Covid volume is required' })
    covid: number;

    @IsNotEmpty({ message: 'Covid flu volume is required' })
    covidFlu: number;

    @IsNotEmpty({ message: 'Clinical volume is required' })
    clinical: number;

    @IsNotEmpty({ message: 'Gastro volume is required' })
    gastro: number;

    @IsNotEmpty({ message: 'Nail volume is required' })
    nail: number;

    @IsNotEmpty({ message: 'Pgx test Volume is required' })
    pgx: number;

    @IsNotEmpty({ message: 'Respiratory panel volume is required' })
    rpp: number;

    @IsNotEmpty({ message: 'Toxicology volume is required' })
    tox: number;

    @IsNotEmpty({ message: 'Urinalysis volume is required' })
    ua: number;

    @IsNotEmpty({ message: 'UTI panel volume is required' })
    uti: number;

    @IsNotEmpty({ message: 'Wound volume is required' })
    wound: number;

    @IsNotEmpty({ message: 'Cardiac volume is required' })
    card: number;

    @IsNotEmpty({ message: 'Cgx panel volume is required' })
    cgx: number;

    @IsNotEmpty({ message: 'Diabetes volume is required' })
    diabetes: number;

    @IsNotEmpty({ message: 'Pad alzheimers volume is required' })
    pad: number;

    @IsNotEmpty({ message: 'Pulmonary panel volume is required' })
    pul: number;

    @IsNotEmpty({ message: 'Total volume is required' })
    total: number;

    @IsNotEmpty({ message: 'Facilities volume is required' })
    new_facilities: number;


}
