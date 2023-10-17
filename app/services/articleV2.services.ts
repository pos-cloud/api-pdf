import axios from "axios";
import { Type, attributes } from "../models/atribute";

export async function getItem(token: string) {
  const columns = attributes
  let userType: string = ""
  let currentPage: number = 0;
  let itemsPerPage = 10;
  let sort = {
    code: 1,
  };
  let articleType: Type;
  let filters: any
  filters = new Array();
  for (let field of columns) {
    if (field.defaultFilter) {
      filters[field.name] = field.defaultFilter;
    } else {
      filters[field.name] = "";
    }
  }
  let match: any = `{`;
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].visible || columns[i].required) {
      let value = filters[columns[i].name];
      if (value && value != "") {
        if (columns[i].defaultFilter) {
          match += `"${columns[i].name}": ${columns[i].defaultFilter}`;
        } else {
          match += `"${columns[i].name}": { "$regex": "${value}", "$options": "i"}`;
        }
        if (i < columns.length - 1) {
          match += ",";
        }
      }
    }
  }

  if (match.charAt(match.length - 1) === ",")
    match = match.substring(0, match.length - 1);
  match += `}`;
  match = JSON.parse(match);

  if (userType === "admin") {
    match["type"] = articleType;
  }

  // ARMAMOS EL PROJECT SEGÚN DISPLAYCOLUMNS
  let project: any = `{`;
  let j = 0;
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].visible || columns[i].required) {
      if (j > 0) {
        project += `,`;
      }
      j++;
      if (!columns[i].project) {
        if (columns[i].datatype !== "string") {
          if (columns[i].datatype === "date") {
            project += `"${columns[i].name}": { "$dateToString": { "date": "$${columns[i].name}", "format": "%d/%m/%Y", "timezone": "${this.timezone}" }}`;
          } else {
            project += `"${columns[i].name}": { "$toString" : "$${columns[i].name}" }`;
          }
        } else {
          project += `"${columns[i].name}": 1`;
        }
      } else {
        project += `"${columns[i].name}": ${columns[i].project}`;
      }
    }
  }
  project += `}`;

  project = JSON.parse(project);

  // AGRUPAMOS EL RESULTADO
  let group = {
    _id: null as any,
    count: { $sum: 1 },
    items: { $push: "$$ROOT" },
  };

  let page = 0;
  if (currentPage != 0) {
    page = currentPage - 1;
  }
  let skip = !isNaN(page * itemsPerPage) ? page * itemsPerPage : 0; // SKIP
  let limit = itemsPerPage;

  let response = await getArticlesV2(
    token,
    project,
    match,
    sort,
    group,
    limit,
    skip
  )
  if (response && response[0] && response[0].items) {
    return response[0].items
  } else {
    return 'Not Foud'
  }
}

async function getArticlesV2(
  token: string,
  project: {},
  match: {},
  sort: {},
  group: {},
  limit: number = 0,
  skip: number = 0
) {
  try {
    const URL = `${process.env.APIV1}v2/articles`;
    const headers = {
      'Authorization': token,
    };
    const params = {
      project: JSON.stringify(project),
      match: JSON.stringify(match),
      sort: JSON.stringify(sort),
      group: JSON.stringify(group),
      limit: limit.toString(),
      skip: skip.toString(),
    };

    const data = await axios.get(URL, { headers, params })

    return data.data
  } catch (error) {
    console.log(error)
  }

}