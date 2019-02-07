export class token {
    status : string;
    success : boolean;
    token : string;
    qsToken : qsToken;
    trigram : string;
}

class qsToken {
    UserDirectory : string;
    UserId : string;
    Attributes : [string];
    Ticket: string;
    TargetUri : string;
}