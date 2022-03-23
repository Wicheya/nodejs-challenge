import { APP_CONST } from "../config/constants.js";

export class SearchResponseFactory {
  getSearchResponse({ items, links } = {}) {
    if (!items) {
      items = [];
      for (let i = 1; i <= 10; i++) {
        items.push(
          this.getItems({
            name: "mock-repository-name" + i,
            fullName: "mock/repository-name" + i,
          })
        );
      }
    }

    if (!links) links = this.getRequestHeaderLink();

    return {
      headers: { link: links },
      data: { items },
    };
  }

  getItems({
    name,
    fullName,
    description,
    htmlUrl,
    language,
    login,
    homepage,
    createdAt,
    updatedAt,
    stargazersCount,
  } = {}) {
    return {
      name: name || "repository-name",
      full_name: fullName || "mock/repository-name",
      description: description || "mock-description",
      html_url: htmlUrl || "https://mock-html-url.com",
      language: language || "mock-language",
      login: login || "mock-owner",
      homepage: homepage || "https://mock-homepage.com",
      created_at: createdAt || new Date().toISOString(),
      updated_at: updatedAt || new Date().toISOString(),
      stargazers_count: stargazersCount || "9999",
    };
  }

  getRequestHeaderLink({ first, prev, next, last } = {}) {
    const links = [];
    if (first !== null) {
      links.push(
        `<${
          first === undefined
            ? `${APP_CONST.GITHUB_SEARCH_REPO_API}?page=1`
            : first
        }> ; rel="first"`
      );
    }

    if (prev !== null) {
      links.push(
        `<${
          prev === undefined
            ? `${APP_CONST.GITHUB_SEARCH_REPO_API}?page=1`
            : prev
        }> ; rel="prev"`
      );
    }

    if (next !== null) {
      links.push(
        `<${
          next === undefined
            ? `${APP_CONST.GITHUB_SEARCH_REPO_API}?page=3`
            : next
        }> ; rel="next"`
      );
    }

    if (last !== null) {
      links.push(
        `<${
          last === undefined
            ? `${APP_CONST.GITHUB_SEARCH_REPO_API}?page=99`
            : last
        }> ; rel="last"`
      );
    }

    return links.join(",");
  }
}
