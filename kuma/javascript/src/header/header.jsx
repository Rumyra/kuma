//@flow
import * as React from 'react';
import { useContext } from 'react';
import { css } from '@emotion/core';

import DocumentProvider from '../document-provider.jsx';
import { getLocale, gettext } from '../l10n.js';
import LanguageMenu from './language-menu.jsx';
import Login from './login.jsx';
import Logo from '../icons/logo.svg';
import Dropdown from './dropdown.jsx';
import { Row, Spring } from '../layout.jsx';
import Search from './search.jsx';

const DESKTOP = '@media (min-width: 1024px)';
const TABLET = '@media (min-width: 750px) and (max-width: 1023px)';
const PHONE = '@media (max-width: 749px)';

const styles = {
    header: css({
        borderTop: '4px solid #83d0f2',
        display: 'grid',
        alignItems: 'center',
        [DESKTOP]: {
            fontSize: 15,
            gridTemplateColumns: '274px 500px minmax(80px, 1fr) 125px',
            columnGap: '10px',
            gridTemplateAreas: '"I M S L"' // Icon Menus Search Login
        },

        [TABLET]: {
            fontSize: 12,
            gridTemplateColumns: 'repeat(10, 1fr)',
            columnGap: '5px',
            gridTemplateAreas: '"I I I S S S S S L L" "M M M M M M M M M M"'
        },

        [PHONE]: {
            fontSize: 10,
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateAreas: '"I I L L" "S S S S" "M M M M"'
        }
    }),

    logoContainer: css({
        display: 'block',
        gridArea: 'I'
    }),
    logo: css({
        // header style sets 1em to 15, 12, or 10px
        height: '4em'
    }),
    menus: css({
        gridArea: 'M',
        flexWrap: 'wrap',
        margin: '0 5px',
        button: {
            [DESKTOP]: {
                fontSize: 16,
                fontWeight: 'bold',
                lineHeight: '32px'
            },

            [TABLET]: {
                fontSize: 14,
                fontWeight: 'bold',
                lineHeight: '28px'
            },

            [PHONE]: {
                fontSize: 12,
                fontWeight: 'normal',
                lineHeight: '24px'
            }
        }
    }),
    search: css({
        gridArea: 'S',
        margin: '2px 8px',
        justifySelf: 'stretch'
    }),
    login: css({
        gridArea: 'L',
        justifySelf: 'end',
        marginRight: 15
    })
};

const menus = [
    {
        label: 'Technologies',
        items: [
            { url: 'Web/HTML', label: 'HTML' },
            { url: 'Web/CSS', label: 'CSS' },
            { url: 'Web/JavaScript', label: 'JavaScript' },
            { url: 'Web/Guide/Graphics', label: 'Graphics' },
            { url: 'Web/HTTP', label: 'HTTP' },
            { url: 'Web/API', label: 'APIs / DOM' },
            {
                url: 'Mozilla/Add-ons/WebExtensions',
                label: 'Browser Extensions'
            },
            { url: 'Web/MathML', label: 'MathML' }
        ]
    },
    {
        label: 'References & Guides',
        items: [
            { url: 'Learn', label: 'Learn web development' },
            { url: 'Web/Tutorials', label: 'Tutorials' },
            { url: 'Web/Reference', label: 'References' },
            { url: 'Web/Guide', label: 'Developer Guides' },
            { url: 'Web/Accessibility', label: 'Accessibility' },
            { url: 'Games', label: 'Game development' },
            { url: 'Web', label: '...more docs' }
        ]
    },
    {
        label: 'Feedback',
        items: [
            {
                url: 'https://support.mozilla.org/',
                label: 'Get Firefox help',
                external: true
            },
            {
                url: 'https://stackoverflow.com/',
                label: 'Get web development help',
                external: true
            },
            { url: 'MDN/Community', label: 'Join the MDN community' },
            {
                label: 'Report a content problem',
                external: true,
                // See fixurl() for code that replaces the {{SLUG}}
                url:
                    'https://github.com/mdn/sprints/issues/new?template=issue-template.md&projects=mdn/sprints/2&labels=user-report&title={{SLUG}}'
            },
            {
                label: 'Report a bug',
                external: true,
                url: 'https://bugzilla.mozilla.org/form.mdn'
            }
        ]
    }
];

export default function Header(): React.Node {
    const documentData = useContext(DocumentProvider.context);
    const locale = getLocale();
    if (!documentData) {
        return null;
    }

    function fixurl(url) {
        // The "Report a content issue" menu item has a link that requires
        // the document slug, so we work that in here.
        url = url.replace('{{SLUG}}', encodeURIComponent(documentData.slug));
        if (!url.startsWith('https://')) {
            url = `/${locale}/docs/${url}`;
        }
        return url;
    }

    return (
        <div css={styles.header}>
            <a css={styles.logoContainer} href={`/${locale}/`}>
                <Logo css={styles.logo} alt="MDN Web Docs Logo" />
            </a>
            <Row css={styles.menus}>
                {menus.map((m, index) => (
                    <Dropdown label={gettext(m.label)} key={index}>
                        {m.items.map((item, index) => (
                            <li key={index}>
                                {item.external ? (
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={fixurl(item.url)}
                                    >
                                        {gettext(item.label)} &#x1f310;
                                    </a>
                                ) : (
                                    <a href={fixurl(item.url)}>
                                        {gettext(item.label)}
                                    </a>
                                )}
                            </li>
                        ))}
                    </Dropdown>
                ))}
                <Spring />
                <LanguageMenu />
            </Row>
            <div css={styles.search}>
                <Search />
            </div>
            <div css={styles.login}>
                <Login />
            </div>
        </div>
    );
}