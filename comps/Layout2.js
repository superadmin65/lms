import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Svg from 'components/Svg';
const Styled = styled.div`
  //background-color: var(--${(p) => (p.spl ? 'l3' : 'l')});
  background-color: var(--l2);

  .mainMenu {
    cursor: pointer;
    user-select: none;
    width: 32px;
    height: 32px;
    stroke: var(--d);
    fill: none;
    stroke-width: 4px;
  }

  & > header {
    display: flex;
    align-items: center;
    min-height: 80px;
    padding: 0 20px;
    justify-content: space-between;
    align-items: center;
    h1 {
      font-family: var(--font1);

      a {
        //color: white;
      }
    }

    nav {
      font-family: var(--font1);
      font-size: 1.5rem;
      color: white;

      a {
        //color: white;
        margin-left: 50px;
      }
    }

    @media (max-width: 500px) {
      nav {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .logoDiv {
    display: flex;
    align-items: center;

    img {
      margin-right: 10px;
    }
  }

  & > main {
    min-height: 90vh;
  }

  & > footer {
    min-height: 50px;
    background-color: var(--d);
    color: white;
    padding: 20px;
    text-align: right;

    .quicklinks {
      display: flex;
      margin-bottom: 20px;
      max-width: 800px;
      flex-wrap: wrap;
      justify-content: center;
      margin: 0 auto;
      .qLabel {
        font-weight: bold;
        margin: 5px 25px;
        color: yellow;
      }

      a {
        color: white;
        display: block;
        margin: 5px 25px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
`;

const splPages = ['/', '/template', '/about'];

export default function Layout(props) {
  let path = usePathname();
  const [state, setState] = useState({
    smallScreen: false,
    expanded: false,
  });
  const dynamicRoute = useRouter().asPath;
  useEffect(() => {
    if (window.innerWidth < 500) {
      setState({ ...state, smallScreen: true, expanded: false });
    }
  }, [dynamicRoute]);
  return (
    // <Styled spl={splPages.indexOf(path) !== -1}>
    <Styled $spl={splPages.indexOf(path) !== -1}>
      <main>{props.children}</main>
      {/* <Link href="/" style={{ position: 'absolute', top: 20, right: 20 }}>
        <Svg
          d={
            'M20 7.093v-5.093h-3v2.093l3 3zm4 5.907l-12-12-12 12h3v10h18v-10h3zm-5 8h-14v-10.26l7-6.912 7 6.99v10.182zm-5-1h-4v-6h4v6z'
          }
        />
      </Link> */}
    </Styled>
  );
}
