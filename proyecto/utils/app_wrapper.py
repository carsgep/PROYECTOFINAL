import base64

import dash_core_components as dcc
import dash_html_components as html


def app_page_layout(page_layout,
                    app_title="Dash Bio App",
                    app_name="",
                    light_logo=True,
                    standalone=False,
                    bg_color="#506784",
                    font_color="#F3F6FA"):
    return html.Div(
        id='main_page',
        children=[
            dcc.Location(id='url', refresh=False),
            html.Div(
                id='app-page-header',
                children=[
                    
                    html.H2(
                        "    Violencia Intrafamiliar en Colombia"
                    ),

                ],
                style={
                    'background': bg_color,
                    'color': font_color,
                }
            ),
            html.Div(
                id='app-page-content',
                children=page_layout
            )
        ],
    )
