export interface PortfolioItem {
    id: string;
    image: string;
    genre: string;
    author: string;
}

export const PORTFOLIO_DATA: PortfolioItem[] = [
    { id: "iz1", image: "/Section E/irezumi.png", genre: "Irezumi", author: "Artist A" },
    { id: "os1", image: "/Section E/oldschool.png", genre: "Old School", author: "Artist B" },
    { id: "tr1", image: "/Section E/tribal.png", genre: "Tribal", author: "Artist C" },
    { id: "bg1", image: "/Section E/black-and-gray.png", genre: "Black & Grey", author: "Artist D" },
    { id: "bw1", image: "/Section E/blackwork.png", genre: "Blackwork", author: "Artist E" },
    { id: "oa1", image: "/Section E/oriental art.png", genre: "Oriental Art", author: "Artist F" },
    { id: "wc1", image: "/Section E/watercolor.png", genre: "Watercolor", author: "Artist G" },
    { id: "il1", image: "/Section E/illustration.png", genre: "Illustration", author: "Artist H" },
    { id: "md1", image: "/Section E/mandala.png", genre: "Mandala", author: "Artist I" },
    { id: "sy1", image: "/Section E/sak-yant.png", genre: "Sak Yant", author: "Artist J" },
    { id: "lt1", image: "/Section E/lettering.png", genre: "Lettering", author: "Artist K" },
    { id: "et1", image: "/Section E/etc.png", genre: "ETC.", author: "Artist L" },
    // 추가 더미 데이터 (마키 흐름을 위해 각 장르별로 최소 2-3개 이상 있는 것이 좋습니다)
    { id: "iz2", image: "/Section E/irezumi.png", genre: "Irezumi", author: "Artist A" },
    { id: "os2", image: "/Section E/oldschool.png", genre: "Old School", author: "Artist B" },
    { id: "tr2", image: "/Section E/tribal.png", genre: "Tribal", author: "Artist C" },
    { id: "bg2", image: "/Section E/black-and-gray.png", genre: "Black & Grey", author: "Artist D" },
    { id: "bw2", image: "/Section E/blackwork.png", genre: "Blackwork", author: "Artist E" },
    { id: "oa2", image: "/Section E/oriental art.png", genre: "Oriental Art", author: "Artist F" },
    { id: "wc2", image: "/Section E/watercolor.png", genre: "Watercolor", author: "Artist G" },
    { id: "il2", image: "/Section E/illustration.png", genre: "Illustration", author: "Artist H" },
    { id: "md2", image: "/Section E/mandala.png", genre: "Mandala", author: "Artist I" },
    { id: "sy2", image: "/Section E/sak-yant.png", genre: "Sak Yant", author: "Artist J" },
    { id: "lt2", image: "/Section E/lettering.png", genre: "Lettering", author: "Artist K" },
    { id: "et2", image: "/Section E/etc.png", genre: "ETC.", author: "Artist L" },
];
