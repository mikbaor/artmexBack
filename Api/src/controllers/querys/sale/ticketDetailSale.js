/**
 * Require: saleId
 */
function getTarimasSale() {
    ////variables
    //saleId
    return `
    SELECT
        micro_sale."SaleId",
        ta.id as "tarima_id",
        SUM(COALESCE(micro_sale."priceBox", 0)) as "tarima_price"
    FROM "Microsales" AS micro_sale
        INNER JOIN "Boxes" bx on bx.id = micro_sale."BoxId" AND bx."itsSell"
            AND bx."SubstoreId" IS NULL AND bx."TransitId" IS NULL
        INNER JOIN "Tarimas" ta on ta.id = bx."TarimaId"
    WHERE micro_sale."SaleId" = :saleId
    GROUP BY ta.id, micro_sale."SaleId"
    `
}
/**
 * Require: saleId
 */
function getSeparateBoxes() {
    ////variables
    //saleId
    return `
    SELECT
        bx.id,
        bx.cost,
        bx."dollarCost",
        COUNT(bx) as "boxes_count"
    FROM "Microsales" AS micro_sale
        INNER JOIN "Boxes" bx on bx.id = micro_sale."BoxId" AND bx."itsSell"
            AND (bx."SubstoreId" IS NOT NULL OR bx."TransitId" IS NOT NULL)
    WHERE micro_sale."SaleId" = :saleId
    GROUP BY bx.id, bx.cost, bx."dollarCost"
    `
}
/**
 * Require: saleId
 */
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