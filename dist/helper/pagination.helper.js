"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const Pagination = (req_1, filter_1, nameModel_1, ...args_1) => __awaiter(void 0, [req_1, filter_1, nameModel_1, ...args_1], void 0, function* (req, filter, nameModel, limitItems = 4) {
    const pagination = {
        limitItems: limitItems,
        currentPage: 1,
        skip: 0,
        totalPage: 0
    };
    const page = req.query.page;
    if (page) {
        pagination.currentPage = parseInt(page);
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;
    const totalPage = yield nameModel.countDocuments(filter);
    if (totalPage == 0)
        pagination.currentPage = 0;
    pagination.totalPage = Math.ceil(totalPage / pagination.limitItems);
    return pagination;
});
exports.Pagination = Pagination;
