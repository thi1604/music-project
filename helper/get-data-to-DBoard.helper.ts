
export const countData = async (typeModel) => {
  const record = {};
  record["total"] = await typeModel.countDocuments({
    deleted: false
  });
  record["active"] = await typeModel.countDocuments({
    status: "active",
    deleted: false
  });
  record["inactive"] = await typeModel.countDocuments({
    status: "inactive",
    deleted: false
  });
  return record;
}