import base64
import os

import dash
from dash.dependencies import Input, Output, State
import dash_core_components as dcc
import dash_html_components as html
import dash_daq as daq
import pandas as pd
import plotly.graph_objects as go
import json
import os
import datetime
import seaborn as sns
import matplotlib.pyplot as plt
import dfply
from dfply import*
from sodapy import Socrata
from sqlalchemy import create_engine

from dash_bio_utils import gene_expression_reader
import dash_bio

#engine = create_engine('postgresql://viouser:T34m10*@violence.cl09f9utzefm.us-east-2.rds.amazonaws.com/violence')
#df = pd.read_sql("SELECT * from target", engine.connect(), parse_dates=['Fecha'])
df=pd.read_csv('data.csv',parse_dates=['Fecha'])





col_state_abbrev = {
    'ANTIOQUIA': 'ANTIOQUIA',
    'ATLÁNTICO': 'ATLANTICO',
    'SANTAFE DE BOGOTA D.C': '11',
    'BOLÍVAR': 'BOLIVAR',
    'BOYACÁ': 'BOYACA',
    'CALDAS': 'CALDAS',
    'CAQUETÁ': 'CAQUETA',
    'CAUCA': 'CAUCA',
    'CESAR': 'CESAR',
    'CÓRDOBA': 'CORDOBA',
    'CUNDINAMARCA': 'CUNDINAMARCA',
    'CHOCÓ': 'CHOCO',
    'HUILA': 'HUILA',
    'GUAJIRA': 'LA GUAJIRA',
    'MAGDALENA': 'MADGALENA',
    'META': 'META',
    'NARIÑO': 'NARIÑO',
    'QUINDÍO': 'QUINDIO',
    'RISARALDA': 'RISARALDA',
    'SANTANDER': 'SANTANDER',
    'SUCRE': 'SUCRE',
    'VALLE': 'VALLE DEL CAUCA',
    'ARAUCA': 'ARAUCA',
    'CASANARE': 'CASANARE',
    'PUTUMAYO': 'PUTUMAYO',
    'AMAZONAS': 'AMAZONAS',
    'GUAINÍA': 'GUAINIA',
    'GUAVIARE': 'GUAVIARE',
    'VAUPÉS': 'VAUPES',
    'VICHADA': 'VICHADA',
    'SAN ANDRÉS': 'SAN ANDRES',
    'NORTE DE SANTANDER': 'NORTE DE SANTANDER',
    'TOLIMA': 'TOLIMA',
    
}

df['dpto_abbr'] = df['Departamento'].map(col_state_abbrev)
df.Cantidad = df.Cantidad.astype(int)
states_grouped = df.groupby(['dpto_abbr'], as_index=False).sum()
states_grouped=states_grouped.sort_values(by='Cantidad',ascending=False)
states_grouped.head(100)

token = 'pk.eyJ1IjoibmV3dXNlcmZvcmV2ZXIiLCJhIjoiY2o2M3d1dTZiMGZobzMzbnp2Z2NiN3lmdyJ9.cQFKe3F3ovbfxTsM9E0ZSQ'
with open('colombia2.json') as f:
    geojson = json.loads(f.read())


# running directly with Python
if __name__ == '__main__':
    from utils.app_standalone import run_standalone_app

# running with gunicorn (on servers)
elif 'DASH_PATH_ROUTING' in os.environ:
    from utils.app_standalone import run_standalone_app


color_palette = [
    'rgb(128, 0, 96)',
    'rgb(230, 115, 0)',
    'rgb(255, 191, 0)'
]



def header_colors():
    return {
        'bg_color': '#232323',
        'font_color': 'white'
    }


def filter_df(df,sexo,sitio,zona,arma,start_date,end_date):
 dff=df.copy()
 dff['Fecha']=pd.to_datetime(df['Fecha'], format='%Y-%m-%d %H:%M:%S') 
 #Gender filter
 dff=dff[dff['sexo']==sexo]
 #location filter
 if(len(sitio)>0):
   dff=dff[dff['Clase de sitio'].isin(sitio)]
  #zona filter
 dff=dff[dff['Zona'] == zona]  
 if(len(arma)>0):
   dff=dff[dff['Arma empleada'].isin(arma)]
 #start_date filter
 dff=dff[dff['Fecha']>start_date]
 #end_date filter 
 dff=dff[dff['Fecha']<=end_date]
 return dff

def calculate_vics(df, states=None, start_date=None, end_date=None):
    data = []
    dff = df.copy()
    by_date = dff >> group_by(X.Fecha) >> summarize(Cases = X.Fecha.count())
    #sns.lineplot(x = 'Fecha', y = 'Cases', data = by_date, palette='viridis')
    if states:
        dff = dff[(df['State_abbr'].isin(states))]
        
    if  start_date and end_date:
        dff = dff[(df['Fecha'] >= start_date) & (df['Fecha'] <= end_date)]

    #subcategory_grouped = dff.groupby(['Category'], as_index=False)
    #for name, group in subcategory_grouped:
     #   grouped = group.groupby('YearMonth', as_index=False).sum()
    data.append(go.Scatter(x=by_date['Fecha'], y=by_date['Cases'],marker=dict(size=15, color='#FFBF00')))
    
    return data

def calculate_bar(df, states=None, start_date=None, end_date=None):
     data = []
     dff = df.copy()
     dff['YEAR'] =dff['Fecha'].dt.to_period('Y').dt.strftime('%Y')
     by_date = dff >> group_by(X.YEAR) >> summarize(Cases = X.Fecha.count())
     #sns.lineplot(x = 'Fecha', y = 'Cases', data = by_date, palette='viridis')
     if states:
        dff = dff[(df['State_abbr'].isin(states))]
        
     if  start_date and end_date:
        dff = dff[(df['Fecha'] >= start_date) & (df['Fecha'] <= end_date)]

    #subcategory_grouped = dff.groupby(['Category'], as_index=False)
    #for name, group in subcategory_grouped:
     #   grouped = group.groupby('YearMonth', as_index=False).sum()
     data.append(go.Bar(
        x=by_date['YEAR'], y=by_date['Cases'],marker=dict(color='#FFBF00')))
  
    
     return data

def layout():

    return html.Div(id='clustergram-body', className='row app-body',
    style={'margin':'0'},
     children=[


            #dcc.Loading(className='dashbio-loading', children=
            html.Div(
                id='clustergram-wrapper',
                  style={
                    'padding': '30px',
                    'font-size': '20pt',
                    'display':'inline  !important'
                },
        children=[ 
            
          
            
            dcc.Graph(
            id='map-chart',
           # style={'padding': '120px','backgroundColor':'#232323','margin':'0'},    
            
            figure={ 
                'data': [go.Choroplethmapbox(
                    geojson=geojson,
                    locations=states_grouped['dpto_abbr'],
                    z=states_grouped['Cantidad'],
                    colorscale='Viridis',
                    colorbar_title="Casos VIC",
                    hoverinfo='location+z'
                    
                )],
                'layout': go.Layout(
                        autosize=False,
                        width=500,
                        height=600,
                        mapbox_style="dark",
                        mapbox_accesstoken=token,
                        mapbox_zoom=4.4,
                        paper_bgcolor='rgba(0,0,0,0)',
                        plot_bgcolor='rgba(0,0,0,0)',
                        margin={"r":0,"t":0,"l":0,"b":0},
                        mapbox_center = {"lat": 4.7110, "lon": -74.0721}
                        
                    )
            }
        )]),
        #Char
        html.Div(
                id='graph1',    
        children=[ 
             html.H4("CASOS REPORTADOS EN EL TIEMPO"),
        dcc.Graph(
                           id='map1', # Plot 1
                            figure={
                                'data': calculate_vics(df),
                                'layout': go.Layout(
                                    width=400,
                                    height=250,
                                    paper_bgcolor='rgba(0,0,0,0)',
                                    plot_bgcolor='rgba(0,0,0,0)',
                                    margin={"r":0,"t":0,"l":30,"b":30},
                                    #margin={'t': 10, 'r': 10,}
                                )
                            },
                        ),
         html.H4("CASOS REPORTADOS POR AÑO"),
        dcc.Graph(
                           id='map2', # Plot 1
                           
                            figure={
                                'data': calculate_bar(df),
                                'layout': go.Layout(
                                    width=400,
                                    height=250,
                                    paper_bgcolor='rgba(0,0,0,0)',
                                    plot_bgcolor='rgba(0,0,0,0)',
                                    margin={"r":0,"t":0,"l":30,"b":30},
                                    #margin={'t': 10, 'r': 10,}
                                )
                            },
                        ),
        
        ]),
        
        


        html.Div(id='clustergram-control-tabs', className='control-tabs', children=[
            dcc.Tabs(id='clustergram-tabs', value='what-is', children=[
                dcc.Tab(
                    label='Introducción',
                    value='what-is',
                    children=html.Div(className='control-tab', children=[
                        html.H4(className='what-is', children='Violencia Intrafamiliar en Colombia'),
                        html.P('La Violencia Intrafamiliar en Colombia es .....'),
                        html.P(''),
                        html.P(''),
                        html.P('.')
                    ])
                ),
                dcc.Tab(
                    label='Data',
                    value='datasets',
                    children=html.Div(className='control-tab', children=[


                            html.Div(
                            title='Rango de fechas',
                                id="date-choice",
                                children=[
                                     html.H4("Seleccione un rango de fechas"),
                                    dcc.DatePickerRange(
                                        id="date-range",
                                        display_format="MMM YY",
                                        start_date=df['Fecha'].min(),
                                        end_date=df['Fecha'].max()
                                    )
                                ]
                            ),
                            html.Br(),
                            html.Div(
                            'Sexo',
                            title='Sexo',
                            className='fullwidth-app-controls-name',
                        ),


                      dcc.RadioItems(
                                        id="sexo-select",
                                        options=[
                                            {'label': label, 'value': label} for label in df['sexo'].unique()
                                        ],
                                        value='FEMENINO',
                                        labelStyle={'display': 'inline-block'}
                                    ),


                        html.Br(),
                        html.Div(
                            'Clase de sitio',
                            title='Clase de sitio',
                            className='fullwidth-app-controls-name',
                            
                        ),


                        dcc.Dropdown(
                            id='location-select',
                            options=[
                             {'label': label, 'value': label} for label in df['Clase de sitio'].unique()
                         
                                 ],
                            multi=True, value=[]
                        ),

                        html.Br(),
                        html.Div(
                            'Zona',
                            title='Zona',
                            className='fullwidth-app-controls-name',
                        ),


                           dcc.RadioItems(
                                        id="zona-select",
                                        options=[
                                            {'label': label, 'value': label} for label in df['Zona'].unique()
                                        ],
                                        value='URBANA',
                                        labelStyle={'display': 'inline-block'}
                                    ),
                            html.Br(),
                        html.Div(
                            'Arma empleada',
                            title='Arma empleada',
                            className='fullwidth-app-controls-name',
                        ),


                        dcc.Dropdown(
                            id='arma-select',
                            options=[
                             {'label': label, 'value': label} for label in df['Arma empleada'].unique()
                            ],
                            multi=True, value=[]
                        ),

                       

                        html.Hr(),
                        html.Div(
                            id='clustergram-info'
                        ),
                    ])
                ),
                dcc.Tab(
                    label='Graph',
                    value='graph',
                    children=[html.Div(className='control-tab', children=[
                        html.Div(className='app-controls-block', children=[
                            html.Div(
                                'Cluster by:',
                                title='Calculate dendrogram for row data, column '
                                'data, or both.',
                                className='app-controls-name'
                            ),
                            dcc.Dropdown(
                                id='cluster-checklist',
                                options=[
                                    {'label': 'Row', 'value': 'row'},
                                    {'label': 'Column', 'value': 'col'}
                                ],
                                value=['row', 'col'],
                                multi=True
                            )
                        ]),
                        html.Div(className='app-controls-block', children=[
                            html.Div(
                                'Hide labels:',
                                title='Hide labels for the row and/or column ' +
                                'dendrograms.',
                                className='app-controls-name'
                            ),
                            dcc.Dropdown(
                                id='hide-labels',
                                options=[
                                    {'label': 'Row', 'value': 'row'},
                                    {'label': 'Column', 'value': 'col'}
                                ],
                                multi=True,
                                value=['row']
                            ),
                        ]),

                        html.Hr(),

                        html.Div(className='app-controls-block', children=[
                            html.Div(
                                'Color threshold:',
                                className='app-controls-name'
                            ),
                            html.Div(
                                className='app-controls-desc',
                                children='Change the threshold level that is used to ' +
                                'determine separate clusters.',
                            ),
                        ]),

                        html.Br(),

                        html.Div(
                            id='threshold-wrapper',
                            children=[
                                'Column: ',
                                dcc.Slider(
                                    id='column-threshold',
                                    className='control-slider',
                                    min=0,
                                    max=20,
                                    step=0.5,
                                    value=10
                                ),
                                html.Br(),
                                'Row: ',
                                dcc.Slider(
                                    id='row-threshold',
                                    className='control-slider',
                                    min=0,
                                    max=20,
                                    step=0.5,
                                    value=10
                                )
                            ]
                        ),

                        html.Br(),

                        html.Hr(),

                        html.Div(
                            id='add-group-markers',
                            children=[
                                html.Div(className='app-controls-block', children=[
                                    html.Div(
                                        className='app-controls-name',
                                        children='Annotations:'
                                    ),
                                    html.Button(
                                        id='remove-all-group-markers',
                                        children='Remove all',
                                        n_clicks=0,
                                        n_clicks_timestamp=0
                                    ),

                                    html.Div(className='app-controls-desc', children=[
                                        'Annotate your heatmap by labeling clusters; '
                                        'below, you can choose a color for the annotation, '
                                        'as well as text for the annotation. Then, click '
                                        'on the row cluster or column cluster that you '
                                        'wish to annotate.']),
                                ]),
                                daq.ColorPicker(
                                    id='clustergram-annot-color',
                                    value={'hex': color_palette[0]},
                                    size=315
                                ),
                                dcc.Input(
                                    id='annotation',
                                    placeholder='annotation text',
                                    type='text',
                                    value=''
                                ),
                            ]
                        ),

                        html.Br(),

                        html.Hr(),

                        html.Div(className='app-controls-block', children=[
                            html.Div(
                                'Rows to display:',
                                title='Select a subset of rows from the uploaded ' +
                                'or preloaded dataset to compute clustering on.',
                                className='fullwidth-app-controls-name'
                            ),

                            dcc.Dropdown(
                                id='selected-rows',
                                multi=True,
                                value=[]
                            )
                        ]),

                        html.Div(className='app-controls-block', children=[
                            html.Div(
                                'Columns to display:',
                                title='Select a subset of columns from the uploaded ' +
                                'or preloaded dataset to compute clustering on.',
                                className='fullwidth-app-controls-name'
                            ),
                            dcc.Dropdown(
                                id='selected-columns',
                                multi=True,
                                value=[]
                            ),
                        ])
                    ])]
                )
            ]),


            dcc.Store(
                id='data-meta-storage'
            ),

            dcc.Store(
                id='fig-options-storage'
            ),

            dcc.Store(
                id='computed-traces'
            ),

            dcc.Store(
                id='curves-dict'
            ),

            dcc.Store(
                id='group-markers'
            ),
        ])
    ])

def callbacks(_app):

    
    @_app.callback(
    [
        dash.dependencies.Output('map-chart','figure' ),
        dash.dependencies.Output('map1','figure' ),
        dash.dependencies.Output('map2','figure' )
        ],
    #dash.dependencies.Output('debug', 'children')],
    [
         dash.dependencies.Input('date-range', 'start_date'),
        dash.dependencies.Input('date-range', 'end_date'),
        dash.dependencies.Input('sexo-select', 'value'),
        dash.dependencies.Input('location-select', 'value'),
        dash.dependencies.Input('zona-select', 'value'),
        dash.dependencies.Input('arma-select', 'value')

    ])
    def update_map(start,end,sexo,location,zona,arma):
        dff = filter_df(df, sexo, location, zona, arma,start,end)
        #dff=df
        dff.Cantidad = dff.Cantidad.astype(int)
        states_grouped_f = dff.groupby(['dpto_abbr'], as_index=False).sum()
        states_grouped_f=states_grouped_f.sort_values(by='Cantidad',ascending=False)
        return { 
                'data': [go.Choroplethmapbox(
                    geojson=geojson,
                    locations=states_grouped_f['dpto_abbr'],
                    z=states_grouped_f['Cantidad'],
                    colorscale='Viridis',
                    colorbar_title="Casos VIC",
                    hoverinfo='location+z'
                    
                )],
                'layout': go.Layout(
                      
                        autosize=False,
                        width=500,
                        height=600,
                        mapbox_style="dark",
                        mapbox_accesstoken=token,
                        mapbox_zoom=4.4,
                        paper_bgcolor='rgba(0,0,0,0)',
                        plot_bgcolor='rgba(0,0,0,0)',
                        margin={"r":0,"t":20,"l":0,"b":0},
                        mapbox_center = {"lat": 4.7110, "lon": -74.0721}
                        
                    )
            },{
                                'data': calculate_vics(dff),
                                'layout': go.Layout(
                                    width=400,
                                    height=250,
                                    paper_bgcolor='rgba(0,0,0,0)',
                                    plot_bgcolor='rgba(0,0,0,0)',
                                    margin={"r":0,"t":0,"l":30,"b":30},
                                    #margin={'t': 10, 'r': 10,}
                                )
                            },{
                                'data': calculate_bar(dff),
                                'layout': go.Layout(
                                    width=400,
                                    height=250,
                                    paper_bgcolor='rgba(0,0,0,0)',
                                    plot_bgcolor='rgba(0,0,0,0)',
                                    margin={"r":0,"t":0,"l":30,"b":30},
                                    #margin={'t': 10, 'r': 10,}
                                )
                            }

          
      

        #,[ html.H6(start),html.H6(end),html.H6(start),html.H6(sexo),html.H6(location),html.H6(arma),html.H6(zona),html.H6(zona)]



    @_app.callback(
        Output('data-meta-storage', 'data'),
        [Input('file-upload', 'contents'),
         Input('file-upload', 'filename'),
         Input('clustergram-datasets', 'value')]
    )
    def store_file_meta_data(contents, filename, dataset_name):
        return True
 
# only declare app/server if the file is being run directly
if 'DASH_PATH_ROUTING' in os.environ or __name__ == '__main__':
    app = run_standalone_app(layout, callbacks, header_colors, __file__)
    server = app.server

if __name__ == '__main__':
    app.run_server(debug=True,host='0.0.0.0', port=8050)
