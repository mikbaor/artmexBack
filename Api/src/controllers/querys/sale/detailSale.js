function getTarimasSale() {
    ////variables
    //saleId
    return `
    SELECT
        micro_sale."SaleId",
        SUM(COALESCE(micro_sale."priceBox", 0)) as "tarima_price",
        ta.id as "tarima"
    FROM "Microsales" AS micro_sale
        INNER JOIN "Boxes" bx on bx.id = micro_sale."BoxId" AND bx."itsSell"
            AND bx."SubstoreId" IS NULL AND bx."TransitId" IS NULL
        INNER JOIN "Tarimas" ta on ta.id = bx."TarimaId"
    WHERE micro_sale."SaleId" = :saleId
    GROUP BY ta.id, micro_sale."SaleId"
    `
}

function getSeparateBoxes() {
    ////variables
    //saleId
    return `
    SELECT
        bx.id,
        bx.cost,
        bx."dollarCost"
    FROM "Microsales" AS micro_sale
        INNER JOIN "Boxes" bx on bx.id = micro_sale."BoxId" AND bx."itsSell"
            AND (bx."SubstoreId" IS NOT NULL OR bx."TransitId" IS NOT NULL)
    WHERE micro_sale."SaleId" = :saleId
    `
}

function getDetailClientAndPay() {
    ////variables
    //saleId
    return `
    SELECT
        sa.id,
        sa.date,
        sa."UserId",
        cli."nombreDueño" as "client_name",
        cli."taxID" as "client_tax_id",
        pa.status as "payment_status",
        COALESCE(pa."totalAmmountPay", 0) as "payment_pay",
        COALESCE(pa."debtAmmount", 0) as "payment_debt"
    FROM "Sales" AS sa
        INNER JOIN "Clients" as cli on cli.id = sa."ClientId"
        INNER JOIN "Payments" as pa on pa.id = sa."PaymentId"
    WHERE sa.id = :saleId
    `
}

module.exports = {
    getTarimasSale,
    getSeparateBoxes,
    getDetailClientAndPay
}