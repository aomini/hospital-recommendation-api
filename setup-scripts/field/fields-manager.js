const { Field, FieldItem } = require("../../models");

const fields = require("./fields");

(async () => {
  let fieldItems = [];

  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    const { section, items, ...rest } = field;
    const parentSection = field.parentSection
      ? await Field.findOne({ where: { name: field.parentSection } })
      : null;

    const fieldData = {
      order: index + 1,
      name: field.section,
      parent_id: parentSection ? parentSection.id : null,
      meta: rest,
    };

    const createdField = await Field.create(fieldData);
    if (items) {
      const createdFieldItems = items.map((item, itemIndex) => {
        const { title, subtitle = null, code, type, ...rest } = item;
        return {
          field_id: createdField.id,
          title,
          subtitle,
          code,
          type,
          order: itemIndex + 1,
          meta: { ...rest },
          userc_id: 1,
        };
      });
      fieldItems = [...fieldItems, ...createdFieldItems];
    }
  }
  await FieldItem.bulkCreate(fieldItems);
})();
