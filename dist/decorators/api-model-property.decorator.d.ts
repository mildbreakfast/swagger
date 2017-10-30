export declare const ApiModelProperty: (metadata?: {
    description?: string;
    required?: boolean;
    type?: any;
    isArray?: boolean;
    default?: any;
}) => PropertyDecorator;
export declare const ApiModelPropertyOptional: (metadata?: {
    description?: string;
    type?: any;
    isArray?: boolean;
    default?: any;
}) => PropertyDecorator;
